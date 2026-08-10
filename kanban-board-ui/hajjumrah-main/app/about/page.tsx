import Image from 'next/image'

export const metadata = {
  title: 'About Hajj Umrah Tours | Our Story & Mission',
  description: 'Learn about our commitment to making Hajj and Umrah accessible with luxury, spirituality, and expertise.',
}

export default function AboutPage() {
  const stats = [
    { number: '5000+', label: '[INSERT: Number of pilgrims served]' },
    { number: '99%', label: 'Customer Satisfaction Rate' },
    { number: '15+', label: '[INSERT: Years in business]' },
    { number: '50+', label: '[INSERT: Team members worldwide]' },
  ]

  const values = [
    {
      title: 'Spiritual Excellence',
      description: '[INSERT: Your commitment to spiritual guidance and authentic pilgrimage experience]',
      icon: '🕌',
    },
    {
      title: 'Luxury Care',
      description: '[INSERT: Your approach to premium accommodations and services]',
      icon: '✨',
    },
    {
      title: 'Expert Guidance',
      description: '[INSERT: Your team expertise and credentials]',
      icon: '👥',
    },
    {
      title: 'Personal Touch',
      description: '[INSERT: Your commitment to personalized attention]',
      icon: '❤️',
    },
  ]

  return (
    <main className="bg-background text-foreground pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-ivory mb-6 text-balance">
            Our Story
          </h1>
          <p className="text-xl text-stone max-w-3xl mx-auto text-balance break-words">
            [INSERT: Compelling story about founding, mission, and values that led to creating the company]
          </p>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl mb-12">
          <img
            src="/images/professional-team.png"
            alt="Professional team at Hajj Umrah Tours"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="font-display text-4xl font-bold text-gold mb-2 break-words">{stat.number}</p>
              <p className="text-stone text-sm break-words">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-ivory mb-12 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="p-8 rounded-xl bg-card border border-gold/20 hover:border-gold/50 transition-colors">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="font-display text-2xl font-bold text-gold mb-4 break-words">{value.title}</h3>
              <p className="text-stone text-base break-words leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl font-bold text-ivory mb-12 text-center">Why Choose Us</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          {[
            { title: '[INSERT: Unique offering 1]', description: '[INSERT: Description and benefits]' },
            { title: '[INSERT: Unique offering 2]', description: '[INSERT: Description and benefits]' },
            { title: '[INSERT: Unique offering 3]', description: '[INSERT: Description and benefits]' },
            { title: '[INSERT: Unique offering 4]', description: '[INSERT: Description and benefits]' },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-bold">{idx + 1}</span>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-display text-xl font-bold text-gold mb-2 break-words">{item.title}</h3>
                <p className="text-stone break-words">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="font-display text-4xl font-bold text-ivory mb-6">Ready to Start Your Sacred Journey?</h2>
        <p className="text-stone text-lg mb-8 max-w-2xl mx-auto break-words">[INSERT: Call-to-action message]</p>
        <a
          href="/contact"
          className="inline-block px-8 py-4 bg-gold text-ink font-bold rounded-lg hover:bg-gold/90 transition-colors"
        >
          Get Started Today
        </a>
      </section>
    </main>
  )
}
