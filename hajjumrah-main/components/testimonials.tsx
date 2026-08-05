'use client'

import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: 'Aisha Ahmed',
    location: 'London, UK',
    avatar: '/images/avatar-1.png',
    quote:
      'The pilgrimage was transformative. Every detail was handled with grace and spiritual wisdom. I felt cared for every moment of my journey.',
    rating: 5,
  },
  {
    name: 'Mohammad Hassan',
    location: 'Dubai, UAE',
    avatar: '/images/avatar-2.png',
    quote:
      'Professional, compassionate, and deeply respectful of our faith. This wasn&apos;t just a tour—it was a sacred experience shared with family.',
    rating: 5,
  },
  {
    name: 'Fatima Khan',
    location: 'New York, USA',
    avatar: '/images/avatar-3.png',
    quote:
      'My first Hajj was overwhelming, but the team guided us through every step with patience and expertise. Unforgettable blessing.',
    rating: 5,
  },
  {
    name: 'Ibrahim Ali',
    location: 'Toronto, Canada',
    avatar: '/images/avatar-1.png',
    quote:
      'Years of dreaming about Hajj, and it exceeded all expectations. The hotels were luxurious, the guides were knowledgeable, the food was delicious.',
    rating: 5,
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setActiveIndex(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlay(false)
  }

  return (
    <section className="py-24 px-6 bg-ink">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4">
            Blessed
            <br />
            <span className="text-gold">Journeys</span>
          </h2>
          <p className="font-body text-lg text-stone max-w-2xl mx-auto">
            Hear from pilgrims who have transformed their faith through our guided experience
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Testimonial cards */}
          <div className="relative min-h-96 mb-8">
            {testimonials.map((testimonial, idx) => {
              const isActive = idx === activeIndex

              return (
                <div
                  key={idx}
                  className={`transition-all duration-500 ${
                    isActive ? 'opacity-100 scale-100 z-10 relative' : 'absolute inset-0 opacity-0 scale-95 z-0'
                  }`}
                >
                  <div className="bg-gradient-to-br from-card to-ink p-12 rounded-xl border border-gold/20 flex flex-col justify-between min-h-96">
                    {/* Avatar */}
                    <div className="flex-shrink-0 mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={`${testimonial.name} - testimonial avatar`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gold"
                        loading="lazy"
                      />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 flex-shrink-0">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-gold text-lg">
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="font-body text-lg text-ivory leading-relaxed italic mt-6 flex-grow break-words">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex-shrink-0 mt-6">
                      <p className="font-display text-xl font-bold text-gold break-words">
                        {testimonial.name}
                      </p>
                      <p className="text-stone text-sm break-words">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-ink transition-all"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-gold text-gold flex items-center justify-center hover:bg-gold hover:text-ink transition-all"
            >
              →
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-gold w-8'
                    : 'bg-stone/40 hover:bg-stone/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 pt-12 border-t border-stone/20">
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-gold mb-2">5,000+</p>
            <p className="text-stone">Pilgrims Served</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-gold mb-2">99%</p>
            <p className="text-stone">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl font-bold text-gold mb-2">15+</p>
            <p className="text-stone">Years of Experience</p>
          </div>
        </div>
      </div>
    </section>
  )
}
