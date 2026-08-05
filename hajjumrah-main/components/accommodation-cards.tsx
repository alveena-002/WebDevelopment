'use client'

import { useState } from 'react'

const accommodations = [
  {
    category: 'Makkah Hotels',
    items: [
      {
        name: 'Grand Sanctuary Palace',
        tier: 'Luxury 5-Star',
        distance: '50m from Kaaba',
        amenities: ['Marble halls', 'Prayer room view', 'Spa', 'Fine dining'],
        image: 'url("/images/makkah-hotel-1.png")',
      },
      {
        name: 'Pilgrimage Suites',
        tier: 'Premium 4-Star',
        distance: '200m from Kaaba',
        amenities: ['Rooftop views', 'All-day dining', 'Business center', 'Gym'],
        image: 'url("/images/makkah-hotel-2.png")',
      },
      {
        name: 'Blessed Residence',
        tier: 'Comfort 3-Star',
        distance: '500m from Kaaba',
        amenities: ['Breakfast included', 'Shared kitchen', 'Laundry service', 'WiFi'],
        image: 'url("/images/luxury-hotel-lobby.png")',
      },
    ],
  },
  {
    category: 'Transportation',
    items: [
      {
        name: 'Luxury Coach',
        tier: 'Executive',
        distance: 'Air-conditioned seats',
        amenities: ['Reclining seats', 'WiFi', 'Refreshments', 'USB charging'],
        image: 'url("/images/coach-bus.png")',
      },
      {
        name: 'Premium Van',
        tier: 'Comfort',
        distance: '16-passenger capacity',
        amenities: ['Climate control', 'Professional driver', 'First aid kit', 'Water bottles'],
        image: 'url("/images/premium-van.png")',
      },
      {
        name: 'Private Sedan',
        tier: 'VIP',
        distance: '4-passenger capacity',
        amenities: ['Premium upholstery', 'Personal driver', 'Privacy glass', 'Luxury finishes'],
        image: 'url("/images/luxury-suv.png")',
      },
    ],
  },
]

export function AccommodationCards() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4">
            Comfort &
            <br />
            <span className="text-gold">Convenience</span>
          </h2>
          <p className="font-body text-lg text-stone max-w-2xl mx-auto">
            Experience luxury accommodations and premium transportation throughout your journey
          </p>
        </div>

        {/* Accommodation Categories */}
        {accommodations.map((category, categoryIdx) => (
          <div key={categoryIdx} className="mb-16">
            <h3 className="font-display text-3xl font-bold text-gold mb-8">
              {category.category}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {category.items.map((item, itemIdx) => {
                const cardId = `${categoryIdx}-${itemIdx}`
                const isExpanded = expandedCard === cardId

                return (
                  <div
                    key={itemIdx}
                    onMouseEnter={() => setExpandedCard(cardId)}
                    onMouseLeave={() => setExpandedCard(null)}
                    className="group relative h-80 rounded-xl overflow-hidden cursor-pointer transition-all duration-500"
                  >
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: item.image }}
                    >
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                    </div>

                    {/* Base content (always visible) */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                      <div className="min-w-0">
                        <h4 className="font-display text-2xl font-bold text-ivory mb-1 line-clamp-2 break-words">
                          {item.name}
                        </h4>
                        <p className="text-gold text-sm font-semibold break-words">{item.tier}</p>
                      </div>

                      <div>
                        <p className="text-stone text-sm mb-4 break-words">{item.distance}</p>
                      </div>
                    </div>

                    {/* Hover expansion */}
                    <div
                      className={`absolute inset-0 p-6 flex flex-col justify-between bg-black/80 z-20 transition-all duration-300 overflow-y-auto ${
                        isExpanded
                          ? 'opacity-100'
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className="font-display text-2xl font-bold text-gold mb-4 line-clamp-2 break-words">
                          {item.name}
                        </h4>
                        <p className="text-stone text-xs font-mono mb-4 break-words">
                          {item.tier}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-ivory text-xs font-semibold mb-3 flex-shrink-0">
                          AMENITIES & FEATURES
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {item.amenities.map((amenity, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 min-w-0"
                            >
                              <span className="w-1 h-1 bg-gold rounded-full flex-shrink-0 mt-1" />
                              <span className="text-stone text-xs break-words">
                                {amenity}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button className="w-full py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors text-sm flex-shrink-0">
                          Request This
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
