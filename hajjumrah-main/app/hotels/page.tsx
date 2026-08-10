'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const hotels = [
  {
    id: 'makkah-1',
    name: 'Grand Sanctuary Palace',
    city: 'Makkah',
    stars: 5,
    pricePerNight: 350,
    distance: '50m',
    image: '/images/makkah-hotel-1.png',
    amenities: ['Prayer room views', 'Spa & wellness', 'Fine dining', 'Business center', 'WiFi', 'Marble halls'],
    description: '[INSERT: Detailed description of Grand Sanctuary Palace]',
  },
  {
    id: 'makkah-2',
    name: 'Pilgrimage Suites',
    city: 'Makkah',
    stars: 4,
    pricePerNight: 220,
    distance: '200m',
    image: '/images/makkah-hotel-2.png',
    amenities: ['Rooftop restaurant', 'All-day dining', 'Gym', 'Prayer facilities', 'WiFi', '24-hr room service'],
    description: '[INSERT: Detailed description of Pilgrimage Suites]',
  },
  {
    id: 'makkah-3',
    name: 'Blessed Residence',
    city: 'Makkah',
    stars: 3,
    pricePerNight: 120,
    distance: '500m',
    image: '/images/luxury-hotel-lobby.png',
    amenities: ['Breakfast included', 'Prayer room', 'Laundry service', 'WiFi', 'Basic amenities'],
    description: '[INSERT: Detailed description of Blessed Residence]',
  },
  {
    id: 'madinah-1',
    name: 'Madinah Gardens Resort',
    city: 'Madinah',
    stars: 5,
    pricePerNight: 320,
    distance: '[INSERT: Distance]',
    image: '/images/madinah-hotel.png',
    amenities: ['Courtyard gardens', 'Spa', 'Fine dining', 'Prayer area views', 'WiFi', 'Concierge'],
    description: '[INSERT: Detailed description of Madinah Gardens Resort]',
  },
  {
    id: 'madinah-2',
    name: 'Prophet City Hotel',
    city: 'Madinah',
    stars: 4,
    pricePerNight: 180,
    distance: '[INSERT: Distance]',
    image: '/images/madinah-skyline.png',
    amenities: ['Modern design', 'All-day dining', 'Business center', 'WiFi', 'Prayer facilities'],
    description: '[INSERT: Detailed description of Prophet City Hotel]',
  },
]

const vehicles = [
  {
    id: 'coach',
    name: 'Luxury Coach Bus',
    type: 'Group Transport',
    capacity: '50 passengers',
    image: '/images/coach-bus.png',
    features: ['Air-conditioned', 'Reclining seats', 'WiFi on board', 'Refreshments', 'USB charging'],
    pricePerDay: '[INSERT: Price]',
  },
  {
    id: 'van',
    name: 'Premium Executive Van',
    type: 'Group Transport',
    capacity: '16 passengers',
    image: '/images/premium-van.png',
    features: ['Climate control', 'Professional driver', 'First aid kit', 'Water bottles', 'Spacious'],
    pricePerDay: '[INSERT: Price]',
  },
  {
    id: 'suv',
    name: 'Private Luxury SUV',
    type: 'Private Transport',
    capacity: '4-6 passengers',
    image: '/images/luxury-suv.png',
    features: ['Premium upholstery', 'Personal driver', 'Privacy features', 'Luxury finishes', 'WiFi'],
    pricePerDay: '[INSERT: Price]',
  },
]

export default function HotelsPage() {
  const [selectedCity, setSelectedCity] = useState<'All' | 'Makkah' | 'Madinah'>('All')
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null)
  const [priceFilter, setPriceFilter] = useState(500)
  const [starsFilter, setStarsFilter] = useState(0)

  const filteredHotels = hotels.filter((hotel) => {
    const cityMatch = selectedCity === 'All' || hotel.city === selectedCity
    const priceMatch = hotel.pricePerNight <= priceFilter
    const starsMatch = starsFilter === 0 || hotel.stars >= starsFilter
    return cityMatch && priceMatch && starsMatch
  })

  return (
    <main className="bg-background text-foreground pt-20 pb-12">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-ivory mb-6 text-balance">
          Premium Accommodations
        </h1>
        <p className="text-xl text-stone max-w-2xl mx-auto text-balance break-words">
          Luxury hotels and transportation options carefully selected for your comfort and spiritual journey.
        </p>
      </section>

      {/* Hotels Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <h2 className="font-display text-3xl font-bold text-ivory mb-8">Hotels</h2>

        {/* Filters */}
        <div className="mb-8 p-6 bg-card rounded-xl border border-gold/20 space-y-6">
          {/* City Filter */}
          <div>
            <label className="block text-stone text-sm font-semibold mb-3">Filter by City:</label>
            <div className="flex flex-wrap gap-3">
              {['All', 'Makkah', 'Madinah'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city as 'All' | 'Makkah' | 'Madinah')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCity === city
                      ? 'bg-gold text-ink'
                      : 'bg-white/5 text-stone border border-stone/30 hover:border-gold'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <label className="block text-stone text-sm font-semibold mb-3">
              Max Price per Night: <span className="text-gold">${priceFilter}</span>
            </label>
            <input
              type="range"
              min="100"
              max="500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(Number(e.target.value))}
              className="w-full h-2 bg-gold/20 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          {/* Star Filter */}
          <div>
            <label className="block text-stone text-sm font-semibold mb-3">Minimum Stars:</label>
            <div className="flex gap-2">
              {[0, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setStarsFilter(stars)}
                  className={`px-3 py-2 rounded-lg transition-all text-sm ${
                    starsFilter === stars
                      ? 'bg-gold text-ink'
                      : 'bg-white/5 text-stone border border-stone/30 hover:border-gold'
                  }`}
                >
                  {stars === 0 ? 'All' : `${stars}⭐`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all flex flex-col"
              >
                {/* Image */}
                <div className="h-40 w-full overflow-hidden bg-card/50">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-card to-ink flex flex-col flex-grow">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gold text-sm">{'⭐'.repeat(hotel.stars)}</span>
                    <span className="text-stone text-xs">{hotel.stars} stars</span>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-xl font-bold text-ivory mb-1 break-words">{hotel.name}</h3>
                  <p className="text-gold text-sm mb-4 break-words">{hotel.city} • {hotel.distance}</p>

                  {/* Price */}
                  <p className="text-2xl font-bold text-gold mb-4 break-words">${hotel.pricePerNight}/night</p>

                  {/* Amenities (first 3) */}
                  <div className="mb-4 space-y-1 flex-grow">
                    {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-gold text-xs">✓</span>
                        <span className="text-stone text-xs break-words">{amenity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedHotel(expandedHotel === hotel.id ? null : hotel.id)}
                    className="mb-4 text-gold text-sm font-semibold hover:text-gold/80 transition-colors flex items-center gap-1"
                  >
                    {expandedHotel === hotel.id ? 'Less Details' : 'More Details'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedHotel === hotel.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded */}
                  {expandedHotel === hotel.id && (
                    <div className="mb-4 p-4 bg-black/30 rounded-lg space-y-3 border-l-2 border-gold">
                      <div>
                        <p className="text-gold text-xs font-semibold mb-2">All Amenities:</p>
                        <ul className="space-y-1">
                          {hotel.amenities.map((amenity, idx) => (
                            <li key={idx} className="text-stone text-xs break-words">• {amenity}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-ivory text-xs break-words border-t border-gold/20 pt-3">{hotel.description}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <a
                    href="/contact"
                    className="w-full py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors text-center text-sm"
                  >
                    Inquire
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-stone text-lg break-words">No hotels match your filters. Please adjust your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Transportation Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-ivory mb-8" id="transportation">
          Transportation
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 transition-all">
              {/* Image */}
              <div className="h-40 w-full overflow-hidden bg-card/50">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-b from-card to-ink">
                <h3 className="font-display text-xl font-bold text-gold mb-1 break-words">{vehicle.name}</h3>
                <p className="text-stone text-sm mb-3 break-words">{vehicle.type}</p>
                <p className="text-ivory font-semibold mb-4 break-words">{vehicle.capacity}</p>

                <div className="mb-4">
                  <p className="text-stone text-xs font-semibold mb-2">Features:</p>
                  <ul className="space-y-1">
                    {vehicle.features.map((feature, idx) => (
                      <li key={idx} className="text-stone text-xs break-words">✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-2xl font-bold text-gold mb-4 break-words">{vehicle.pricePerDay}/day</p>

                <a
                  href="/contact"
                  className="block w-full py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors text-center text-sm"
                >
                  Reserve
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
