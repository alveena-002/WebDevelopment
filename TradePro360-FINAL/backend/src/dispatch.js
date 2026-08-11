const db = require('./db');

/** Haversine distance in km between two lat/lng points. */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * AI dispatch matcher — mirrors Section 4 of the architecture spec.
 * ETA estimation:
 *  - If GOOGLE_MAPS_API_KEY is set, uses the Google Distance Matrix API to
 *    get a real driving-time ETA between the matched engineer and the
 *    customer.
 *  - Otherwise (no key configured — the zero-setup default) falls back to
 *    the haversine-distance estimate exactly as it worked before, so the
 *    app is fully runnable with no external API keys.
 * Either way the ranking of *which* engineer wins is unchanged — it's
 * still haversine distance + rating, computed locally. Only the ETA shown
 * to the customer for the winning engineer differs.
 */
function estimateEtaMin(distanceKm) {
  const avgSpeedKmh = 32; // urban/suburban average incl. traffic
  const prepBufferMin = 6;
  return Math.max(8, Math.round((distanceKm / avgSpeedKmh) * 60) + prepBufferMin);
}

/** Real road-network ETA via Google Distance Matrix. Returns minutes, or
 *  null on any failure (missing key, network error, no route found) so
 *  the caller can fall back to the haversine estimate. */
async function googleEtaMin(originLat, originLng, destLat, destLng) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', `${originLat},${originLng}`);
    url.searchParams.set('destinations', `${destLat},${destLng}`);
    url.searchParams.set('mode', 'driving');
    url.searchParams.set('departure_time', 'now');
    url.searchParams.set('key', key);

    const resp = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!resp.ok) return null;
    const data = await resp.json();
    const el = data?.rows?.[0]?.elements?.[0];
    if (!el || el.status !== 'OK') return null;
    const seconds = (el.duration_in_traffic || el.duration)?.value;
    if (!seconds) return null;
    return Math.max(1, Math.round(seconds / 60));
  } catch (err) {
    console.warn('[dispatch] Google Distance Matrix lookup failed, falling back to haversine ETA:', err.message);
    return null;
  }
}

async function findNearestEngineer(tenantId, trade, customerLat, customerLng) {
  const candidates = await db.prepare(
    `SELECT * FROM engineers WHERE tenant_id = ? AND trade = ? AND status = 'available'`
  ).all(tenantId, trade);

  let best = null;
  let bestScore = -Infinity;

  for (const eng of candidates) {
    const distanceKm = haversineKm(customerLat, customerLng, eng.lat, eng.lng);
    if (distanceKm > eng.service_radius_km) continue;

    // Weighted score: closer + higher-rated wins. ETA is the dominant
    // factor (negative distance), rating is a tie-breaker.
    const score = -distanceKm * 10 + eng.rating_avg;
    if (score > bestScore) {
      bestScore = score;
      best = { ...eng, distanceKm };
    }
  }

  if (!best) return null;

  const realEta = await googleEtaMin(best.lat, best.lng, customerLat, customerLng);
  const etaMin = realEta != null ? realEta : estimateEtaMin(best.distanceKm);

  return { engineer: best, distanceKm: best.distanceKm, etaMin };
}

module.exports = { haversineKm, estimateEtaMin, googleEtaMin, findNearestEngineer };
