// Photo storage abstraction.
//
//   AWS_S3_BUCKET (+ credentials) set -> uploads to S3 (or any S3-compatible
//     endpoint — MinIO, Cloudflare R2, Backblaze B2 — via AWS_S3_ENDPOINT).
//   otherwise                        -> writes to local disk under
//     backend/uploads/, served statically by server.js at /uploads/*.
//
// The booking photos route (src/routes/bookings.js) currently receives
// `url` as either:
//   - a `data:` URI (base64) — what TradePro360.html sends today, read
//     client-side via FileReader — which this module decodes and stores
//     properly instead of writing the raw base64 string into the database.
//   - an already-hosted http(s) URL — passed straight through untouched.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

const s3Enabled = !!process.env.AWS_S3_BUCKET;

let s3Client = null;
let PutObjectCommand = null;
if (s3Enabled) {
  // Lazy require — keeps @aws-sdk/client-s3 out of the zero-config path
  // entirely (it's only touched at all when S3 env vars are present).
  ({ S3Client: S3ClientCtor, PutObjectCommand } = require('@aws-sdk/client-s3'));
  s3Client = new S3ClientCtor({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.AWS_S3_ENDPOINT || undefined, // for S3-compatible providers
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
    credentials: process.env.AWS_ACCESS_KEY_ID ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined, // undefined -> SDK falls back to IAM role / default credential chain
  });
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function parseDataUrl(dataUrl) {
  const match = /^data:(?<mime>[\w/+.-]+);base64,(?<data>.+)$/s.exec(dataUrl);
  if (!match) return null;
  return { mime: match.groups.mime, buffer: Buffer.from(match.groups.data, 'base64') };
}

function extensionFor(mime) {
  const map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  return map[mime] || 'bin';
}

/**
 * Store a photo for a booking and return the URL the app should keep.
 * @param {string} bookingId
 * @param {string} input - either a data: URI or an already-hosted URL
 * @param {string} publicBaseUrl - origin to prefix local-disk URLs with, e.g. `${req.protocol}://${req.get('host')}`
 */
async function savePhoto(bookingId, input, publicBaseUrl) {
  if (!input) throw new Error('No photo data provided');

  // Already a hosted URL (e.g. re-submitting an existing photo, or a
  // client that uploads elsewhere first) — nothing to do.
  if (/^https?:\/\//i.test(input)) return input;

  const parsed = parseDataUrl(input);
  if (!parsed) throw new Error('Unsupported photo format — expected a data: URI or an http(s) URL');

  const key = `bookings/${bookingId}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(parsed.mime)}`;

  if (s3Enabled) {
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: parsed.buffer,
      ContentType: parsed.mime,
    }));
    if (process.env.AWS_S3_PUBLIC_URL_BASE) {
      return `${process.env.AWS_S3_PUBLIC_URL_BASE.replace(/\/$/, '')}/${key}`;
    }
    const endpoint = process.env.AWS_S3_ENDPOINT
      ? process.env.AWS_S3_ENDPOINT.replace(/\/$/, '')
      : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`;
    return process.env.AWS_S3_ENDPOINT ? `${endpoint}/${process.env.AWS_S3_BUCKET}/${key}` : `${endpoint}/${key}`;
  }

  // Local-disk fallback — zero configuration required.
  ensureUploadDir();
  const localPath = path.join(UPLOAD_DIR, key.replace(/\//g, '_'));
  fs.writeFileSync(localPath, parsed.buffer);
  const filename = path.basename(localPath);
  return `${publicBaseUrl || ''}/uploads/${filename}`;
}

module.exports = { savePhoto, UPLOAD_DIR, s3Enabled };
