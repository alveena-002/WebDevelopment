export const metadata = {
  title: 'Gallery | Hajj Umrah Tours',
  description: 'Browse our collection of pilgrimage experiences and premium accommodations.',
}

const galleryImages = [
  {
    id: 1,
    title: 'Makkah Skyline at Dawn',
    image: '/images/makkah-skyline-dusk.png',
    category: 'Destinations',
  },
  {
    id: 2,
    title: 'Luxury Hotel Lobby',
    image: '/images/luxury-hotel-lobby.png',
    category: 'Accommodations',
  },
  {
    id: 3,
    title: 'Business Class Experience',
    image: '/images/business-class-cabin.png',
    category: 'Travel',
  },
  {
    id: 4,
    title: 'Madinah Sunset',
    image: '/images/madinah-skyline.png',
    category: 'Destinations',
  },
  {
    id: 5,
    title: 'Premium Transportation',
    image: '/images/luxury-suv.png',
    category: 'Transportation',
  },
  {
    id: 6,
    title: 'Family Pilgrimage',
    image: '/images/family-travelers.png',
    category: 'Experiences',
  },
  {
    id: 7,
    title: 'Makkah Hotel',
    image: '/images/makkah-hotel-1.png',
    category: 'Accommodations',
  },
  {
    id: 8,
    title: 'Our Professional Team',
    image: '/images/professional-team.png',
    category: 'Team',
  },
]

export default function GalleryPage() {
  return (
    <main className="bg-background text-foreground pt-20 pb-12">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-ivory mb-6 text-balance">
          Gallery
        </h1>
        <p className="text-xl text-stone max-w-2xl mx-auto text-balance break-words">
          Explore moments from our pilgrimage journeys and premium experiences.
        </p>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end">
                <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-display text-lg font-bold text-ivory break-words">{item.title}</p>
                  <p className="text-gold text-sm">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-gold/10 to-pomegranate/10 border border-gold/20 rounded-xl p-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ivory mb-4 break-words">Ready to Create Your Memories?</h2>
          <p className="text-stone mb-6 max-w-2xl mx-auto break-words">
            [INSERT: Call-to-action message about booking a pilgrimage]
          </p>
          <a
            href="/packages"
            className="inline-block px-8 py-3 bg-gold text-ink font-bold rounded-lg hover:bg-gold/90 transition-colors"
          >
            Explore Packages
          </a>
        </div>
      </section>
    </main>
  )
}
