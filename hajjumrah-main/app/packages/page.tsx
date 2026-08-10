'use client'

import { useState } from 'react'

const packages = [
  {
    id: 'gold-hajj',
    type: 'Hajj',
    tier: 'Gold',
    price: '$2,499',
    duration: '12 days',
    description: 'Essential pilgrimage experience',
    image: '/images/makkah-skyline-dusk.png',
    highlights: [
      'Round-trip economy airfare',
      '3-star accommodations in Makkah & Madinah',
      '7 nights in Makkah (near the Kaaba)',
      '3 nights in Madinah',
      'Daily breakfast and dinner included',
      'Group guided ziyarat tours',
      'Airport transfers and local transport',
      '[INSERT: Additional amenity 1]',
    ],
    included: [
      'Visa assistance',
      'Travel insurance',
      'Spiritual guide',
      'Group WhatsApp support',
    ],
    notIncluded: ['Personal shopping', 'Spa services', 'Premium meals'],
  },
  {
    id: 'platinum-hajj',
    type: 'Hajj',
    tier: 'Platinum',
    price: '$4,299',
    duration: '14 days',
    description: 'Premium comfort & spiritual guidance',
    image: '/images/business-class-cabin.png',
    highlights: [
      'Round-trip business class airfare',
      '4-star premium hotels',
      '8 nights in Makkah (premium location)',
      '4 nights in Madinah',
      'All meals plus premium snacks',
      'Private spiritual advisor assigned',
      'Private airport transfers and transport',
      'Travel insurance premium coverage',
      '24/7 WhatsApp concierge service',
      '[INSERT: Additional amenity 2]',
    ],
    included: [
      'Visa with priority processing',
      'Premium travel insurance',
      'Personal spiritual guide',
      'Photography service (2 sessions)',
    ],
    notIncluded: ['First class flights', 'Spa packages'],
  },
  {
    id: 'royal-hajj',
    type: 'Hajj',
    tier: 'Royal Executive',
    price: '$6,899',
    duration: '15 days',
    description: 'Luxurious, personalized journey',
    image: '/images/luxury-hotel-lobby.png',
    highlights: [
      'Round-trip first class airfare',
      '5-star luxury hotels with suite accommodations',
      '9 nights in Makkah (premium suites)',
      '5 nights in Madinah',
      'Fine dining experiences (3-4 Michelin star style)',
      'Personal spiritual advisor (imam-certified)',
      'Private luxury transportation throughout',
      'Premium travel insurance with 24/7 support',
      'Dedicated 24/7 concierge service',
      'Professional photography & videography service',
      'Spa and wellness packages included',
      'Post-pilgrimage retreat options',
    ],
    included: [
      'VIP visa with diplomatic processing',
      'Premium health insurance',
      'Certified Islamic scholars',
      'Personal photographer',
      'Wellness packages',
    ],
    notIncluded: [],
  },
  {
    id: 'gold-umrah',
    type: 'Umrah',
    tier: 'Gold',
    price: '$1,299',
    duration: '8 days',
    description: 'Accessible Umrah experience',
    image: '/images/makkah-skyline-dusk.png',
    highlights: [
      'Round-trip economy airfare',
      '3-star hotel accommodations',
      '6 nights in Makkah',
      '1 night in Madinah (optional)',
      'Daily breakfast and dinners',
      'Basic guided tours',
      'Airport and mosque transfers',
      'Flexible scheduling',
    ],
    included: [
      'Visa assistance',
      'Basic travel insurance',
      'Guide services',
      'Basic support',
    ],
    notIncluded: ['Premium meals', 'Personal guidance'],
  },
  {
    id: 'platinum-umrah',
    type: 'Umrah',
    tier: 'Platinum',
    price: '$2,899',
    duration: '10 days',
    description: 'Premium Umrah with added comfort',
    image: '/images/business-class-cabin.png',
    highlights: [
      'Round-trip business class airfare',
      '4-star hotel accommodations',
      '7 nights in Makkah (best location)',
      '2 nights in Madinah',
      'All meals included',
      'Private guide assigned',
      'Premium transport and accommodations',
      'Personal attention and customization',
    ],
    included: [
      'Priority visa processing',
      'Premium insurance',
      'Personal guide',
      '24/7 support',
    ],
    notIncluded: ['First class flights'],
  },
]

export default function PackagesPage() {
  const [selectedType, setSelectedType] = useState<'All' | 'Hajj' | 'Umrah'>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = selectedType === 'All' ? packages : packages.filter((p) => p.type === selectedType)

  return (
    <main className="bg-background text-foreground pt-20 pb-12">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-ivory mb-6 text-balance">
          Our Pilgrimage Packages
        </h1>
        <p className="text-xl text-stone max-w-2xl mx-auto text-balance break-words">
          Curated packages designed to make your sacred journey unforgettable. Choose from Hajj or Umrah experiences.
        </p>
      </section>

      {/* Filter Buttons */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-4 justify-center">
          {['All', 'Hajj', 'Umrah'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as 'All' | 'Hajj' | 'Umrah')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedType === type
                  ? 'bg-gold text-ink'
                  : 'bg-card text-gold border border-gold/30 hover:border-gold/60'
              }`}
            >
              {type === 'All' ? 'All Packages' : `${type} Packages`}
            </button>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all hover:shadow-xl hover:shadow-gold/10 flex flex-col"
            >
              {/* Package Image */}
              <div className="h-40 w-full overflow-hidden bg-card/50">
                <img
                  src={pkg.image}
                  alt={`${pkg.tier} ${pkg.type} Package`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Package Content */}
              <div className="p-6 bg-gradient-to-b from-card to-ink flex flex-col flex-grow">
                {/* Type Badge */}
                <div className="inline-flex w-fit mb-3">
                  <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full">
                    {pkg.type}
                  </span>
                </div>

                {/* Tier & Price */}
                <h3 className="font-display text-2xl font-bold text-gold mb-2 break-words">{pkg.tier}</h3>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-ivory break-words">{pkg.price}</p>
                  <p className="text-stone text-sm">{pkg.duration}</p>
                </div>

                {/* Description */}
                <p className="text-stone text-sm mb-6 break-words flex-grow">{pkg.description}</p>

                {/* Quick Highlights (first 3) */}
                <div className="mb-6 space-y-2">
                  {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 min-w-0">
                      <span className="text-gold font-bold flex-shrink-0">✓</span>
                      <span className="text-ivory text-sm break-words">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => setExpandedId(expandedId === pkg.id ? null : pkg.id)}
                  className="mb-4 text-gold hover:text-gold/80 text-sm font-semibold transition-colors"
                >
                  {expandedId === pkg.id ? 'Show Less' : `View All (${pkg.highlights.length})`}
                </button>

                {/* Expanded Details */}
                {expandedId === pkg.id && (
                  <div className="mb-6 p-4 bg-black/30 rounded-lg space-y-4 border-l-2 border-gold">
                    <div>
                      <p className="font-semibold text-gold text-sm mb-2">All Highlights:</p>
                      <ul className="space-y-1">
                        {pkg.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-ivory text-xs break-words flex items-start gap-2">
                            <span className="text-gold flex-shrink-0">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-stone text-xs mb-2">Included Services:</p>
                      <ul className="space-y-1">
                        {pkg.included.map((item, idx) => (
                          <li key={idx} className="text-stone text-xs break-words">✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <a
                  href="/contact"
                  className="w-full py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors text-center break-words"
                >
                  Request Quote
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customization Section */}
      <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-gold/10 to-pomegranate/10 border border-gold/20 rounded-xl p-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ivory mb-4 break-words">Need a Custom Package?</h2>
          <p className="text-stone mb-6 break-words">[INSERT: Information about customization options]</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gold text-ink font-bold rounded-lg hover:bg-gold/90 transition-colors"
          >
            Discuss Custom Itinerary
          </a>
        </div>
      </section>
    </main>
  )
}
