'use client'

import { useState } from 'react'

const packages = [
  {
    name: 'Gold',
    price: '$2,499',
    description: 'Essential pilgrimage experience',
    color: 'from-gold to-gold/80',
    image: '/images/makkah-skyline-dusk.png',
    features: [
      'Round-trip airfare',
      '3-star accommodations',
      '7-night Makkah stay',
      '3-night Madinah stay',
      'Daily meals',
      'Group ziyarat tours',
      'Airport transfers',
    ],
  },
  {
    name: 'Platinum',
    price: '$4,299',
    description: 'Premium comfort & guidance',
    color: 'from-stone to-stone/80',
    image: '/images/business-class-cabin.png',
    features: [
      'Round-trip business class',
      '4-star hotels',
      '8-night Makkah stay',
      '4-night Madinah stay',
      'All meals + snacks',
      'Private guide service',
      'Airport transfers',
      'Travel insurance',
      'WhatsApp concierge',
    ],
  },
  {
    name: 'Royal Executive',
    price: '$6,899',
    description: 'Luxurious, personalized journey',
    color: 'from-pomegranate to-pomegranate/80',
    image: '/images/luxury-hotel-lobby.png',
    features: [
      'Round-trip first class',
      '5-star luxury hotels',
      '9-night Makkah stay',
      '5-night Madinah stay',
      'Fine dining experiences',
      'Personal spiritual advisor',
      'Private transportation',
      'Travel insurance',
      '24/7 concierge',
      'Spa & wellness',
      'Photography service',
    ],
  },
]

export function PackageComparison() {
  const [selectedPackage, setSelectedPackage] = useState<string>('Platinum')

  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4">
            Curated
            <br />
            <span className="text-gold">Packages</span>
          </h2>
          <p className="font-body text-lg text-stone max-w-2xl mx-auto">
            Choose the pilgrimage experience that resonates with your soul and budget
          </p>
        </div>

        {/* Package Selector */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {packages.map((pkg) => (
            <button
              key={pkg.name}
              onClick={() => setSelectedPackage(pkg.name)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedPackage === pkg.name
                  ? 'bg-gold text-ink shadow-lg shadow-gold/50'
                  : 'bg-card text-ivory border border-stone/30 hover:border-gold'
              }`}
            >
              {pkg.name}
            </button>
          ))}
        </div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.name
            return (
              <div
                key={pkg.name}
                className={`rounded-xl overflow-hidden transition-all duration-500 transform flex flex-col ${
                  isSelected ? 'scale-105 shadow-2xl shadow-gold/30' : 'hover:shadow-xl'
                }`}
              >
                {/* Package Card Image */}
                <div className="h-48 w-full overflow-hidden bg-card/50">
                  <img
                    src={pkg.image}
                    alt={`${pkg.name} package - ${pkg.description}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${pkg.color} p-8 text-ink`}
                >
                  <h3 className="font-display text-3xl font-bold mb-2 break-words">{pkg.name}</h3>
                  <p className="text-sm opacity-80 mb-4 break-words">{pkg.description}</p>
                  <div className="text-4xl font-bold">{pkg.price}</div>
                  <p className="text-xs opacity-70 mt-1">per person</p>
                </div>

                {/* Card Body - Flex grow to push button to bottom */}
                <div className="bg-card p-8 flex flex-col flex-grow">
                  <ul className="space-y-4 flex-grow">
                    {pkg.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-ivory text-sm break-words"
                      >
                        <span className="text-gold font-bold flex-shrink-0 mt-1">✓</span>
                        <span className="flex-grow">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full mt-8 py-3 rounded-lg font-semibold transition-all duration-300 flex-shrink-0 ${
                      isSelected
                        ? 'bg-gold text-ink hover:bg-gold/90'
                        : 'bg-gold/20 text-gold border border-gold/50 hover:bg-gold/30'
                    }`}
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
