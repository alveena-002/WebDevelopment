'use client'

import { useState } from 'react'

export function PriceEstimator() {
  const [travelers, setTravelers] = useState(2)
  const [cabinClass, setCabinClass] = useState('economy')
  const [hotelTier, setHotelTier] = useState('premium')

  const basePrice = 2499
  const cabinMultiplier = {
    economy: 0,
    premium: 500,
    business: 1500,
    first: 3000,
  }
  const hotelMultiplier = {
    standard: 0,
    premium: 800,
    luxury: 2000,
  }

  const estimatedPrice =
    (basePrice +
      cabinMultiplier[cabinClass as keyof typeof cabinMultiplier] +
      hotelMultiplier[hotelTier as keyof typeof hotelMultiplier]) *
    travelers

  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4">
            Get Your
            <br />
            <span className="text-gold">Estimate</span>
          </h2>
          <p className="font-body text-lg text-stone">
            Customize your package and see an instant estimate
          </p>
        </div>

        <div className="bg-card p-8 rounded-xl border border-stone/20">
          {/* Sliders and selectors */}
          <div className="space-y-8">
            {/* Travelers */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-ivory">Number of Travelers</label>
                <span className="text-gold font-display text-2xl">{travelers}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                className="w-full h-2 bg-stone/30 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-xs text-stone mt-2">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            {/* Cabin Class */}
            <div>
              <label className="block font-semibold text-ivory mb-4">Cabin Class</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'economy', label: 'Economy' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'business', label: 'Business' },
                  { value: 'first', label: 'First' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCabinClass(option.value)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      cabinClass === option.value
                        ? 'bg-gold text-ink shadow-lg shadow-gold/50'
                        : 'bg-ink border border-stone/30 text-stone hover:border-gold'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hotel Tier */}
            <div>
              <label className="block font-semibold text-ivory mb-4">Hotel Tier</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'standard', label: 'Standard' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'luxury', label: 'Luxury' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setHotelTier(option.value)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                      hotelTier === option.value
                        ? 'bg-gold text-ink shadow-lg shadow-gold/50'
                        : 'bg-ink border border-stone/30 text-stone hover:border-gold'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gold/10 to-pomegranate/10 border border-gold/20 rounded-xl">
            <div className="mb-4">
              <p className="text-stone text-sm font-mono mb-1">ESTIMATED TOTAL</p>
              <p className="font-display text-5xl font-bold text-gold break-words">
                ${estimatedPrice.toLocaleString()}
              </p>
              <p className="text-stone text-sm mt-2 break-words">
                For {travelers} {travelers === 1 ? 'person' : 'people'} • Per person: ${Math.round(estimatedPrice / travelers).toLocaleString()}
              </p>
            </div>

            <p className="text-ivory text-xs mb-6 bg-black/20 p-3 rounded break-words">
              ✓ This estimate includes flights, accommodations, meals, and guided tours
            </p>

            <button className="w-full py-4 bg-gold text-ink font-bold rounded-lg hover:bg-gold/90 transition-colors text-lg flex-shrink-0">
              Get Personalized Quote
            </button>
          </div>

          {/* Features checklist */}
          <div className="mt-8 pt-8 border-t border-stone/20">
            <p className="font-semibold text-ivory mb-4">What&apos;s Included:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Round-trip airfare',
                'Accommodations',
                'Daily meals',
                'Ground transportation',
                'Guided ziyarat tours',
                'Spiritual counseling',
                'Travel insurance',
                'WhatsApp concierge',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gold rounded-full" />
                  <span className="text-stone text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
