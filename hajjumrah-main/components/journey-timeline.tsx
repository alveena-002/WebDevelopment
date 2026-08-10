'use client'

import { useEffect, useRef, useState } from 'react'

const journeyStages = [
  {
    number: '01',
    stage: 'Departure',
    icon: '✈',
    description: 'Your pilgrimage begins the moment you leave home. We arrange comfortable international travel and a calm pre-departure briefing, so you begin this journey at peace, not in a rush.',
    iconColor: 'from-gold to-gold/80', // Travel stage - gold
  },
  {
    number: '02',
    stage: 'Arrival in the Holy Land',
    icon: '🏛',
    description: 'Step into the Kingdom with ease. Our team is waiting to welcome you — smooth airport reception, seamless hotel check-in, and a gentle orientation before your journey of worship begins.',
    iconColor: 'from-gold to-gold/80', // Travel stage - gold
  },
  {
    number: '03',
    stage: 'Days in Makkah',
    icon: '🕌',
    description: 'Seven nights near the House of Allah. Guided tawaf and sa\'y, daily prayers, and quiet moments of reflection — supported by experienced guides who understand what this time means to you.',
    iconColor: 'from-sage to-sage/80', // Spiritual stage - sage
  },
  {
    number: '04',
    stage: 'Ziyarat — Walking Through History',
    icon: '🗻',
    description: 'Visit the sacred landmarks of Mount Arafat, Muzdalifah, and Mina at a comfortable pace, with knowledgeable guides sharing the history and significance of each site.',
    iconColor: 'from-gold to-gold/80', // Travel stage - gold
  },
  {
    number: '05',
    stage: 'Days in Madinah',
    icon: '🌙',
    description: 'A peaceful close to your journey. Visit the Prophet&apos;s Mosque ﷺ, Al-Baqi, and the city&apos;s blessed sites, in the calm and reflective atmosphere Madinah is known for.',
    iconColor: 'from-sage to-sage/80', // Spiritual stage - sage
  },
  {
    number: '06',
    stage: 'Return Home',
    icon: '🏡',
    description: 'You return home changed — carrying the peace, gratitude, and memories of a lifetime. We handle every detail of your departure, so your last moments in the Holy Land are unhurried.',
    iconColor: 'from-gold to-gold/80', // Travel stage - gold
  },
]

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [visibleStages, setVisibleStages] = useState<Set<number>>(new Set())
  const [lineProgress, setLineProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleStages((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.3 }
    )

    const elements = containerRef.current?.querySelectorAll('[data-index]')
    elements?.forEach((el) => observer.observe(el))

    return () => {
      elements?.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Scroll progress for line animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Calculate progress: 0 when section top is below viewport, 1 when section bottom is above viewport
      const progress = Math.min(
        1,
        Math.max(
          0,
          (viewportHeight - rect.top) / (rect.height + viewportHeight)
        )
      )
      
      setLineProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once on mount
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Subtle background texture/depth */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-gold via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4">
            Your Sacred
            <br />
            <span className="text-gold">Journey</span>
          </h2>
          <p className="font-body text-lg text-stone max-w-2xl mx-auto">
            Follow the pilgrimage path through six transformative stages
          </p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Background gradient lines container */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full pointer-events-none">
            {/* Base faded gradient line */}
            <div className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-gold to-transparent opacity-30" />
            
            {/* Progress-filled line - animates on scroll */}
            <div
              ref={lineRef}
              className="absolute inset-0 w-full bg-gradient-to-b from-gold via-gold to-transparent opacity-100 transition-all duration-300"
              style={{
                clipPath: `inset(${100 - lineProgress * 100}% 0 0 0)`,
              }}
            />
          </div>

          {/* Mobile timeline line - single vertical line on left */}
          <div className="md:hidden absolute top-0 left-8 w-1 h-full bg-gradient-to-b from-gold via-gold to-transparent opacity-40" />

          {/* Timeline items */}
          <div className="space-y-16">
            {journeyStages.map((item, idx) => {
              const isVisible = visibleStages.has(idx)
              const isEven = idx % 2 === 0

              return (
                <div
                  key={idx}
                  data-index={idx}
                  className={`timeline-stage-appear flex gap-0 md:gap-8 items-start md:items-center transition-all duration-700 md:flex-row flex-row ${
                    isVisible ? '' : 'opacity-0'
                  }`}
                >
                  {/* Left content (even indices on desktop) */}
                  {isEven && (
                    <div className="hidden md:block flex-1 text-right pr-8">
                      <p className="font-mono text-xs font-semibold text-gold/70 letter-spaced-wider mb-1 tracking-widest">
                        STAGE {item.number}
                      </p>
                      <h3 className="font-display text-3xl font-bold text-ivory mb-3 break-words flex items-center justify-end gap-2">
                        {item.stage}
                        <span className="text-gold text-xl">✦</span>
                      </h3>
                      <p className="text-muted mb-0 break-words leading-relaxed">{item.description}</p>
                    </div>
                  )}

                  {/* Center circle with node marker and glow */}
                  <div className="flex-shrink-0 relative md:z-10">
                    {/* Node ring - visible on all screens */}
                    <div className="absolute -inset-2 rounded-full border-2 border-gold/40 md:border-gold/60 opacity-0 md:opacity-100 transition-opacity duration-500" />
                    
                    {/* Main icon circle with glow */}
                    <div
                      className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${item.iconColor} flex items-center justify-center text-3xl shadow-lg shadow-gold/40 border-2 border-ivory/10 transition-all duration-500 hover:shadow-xl hover:shadow-gold/60 ${
                        isVisible ? 'timeline-icon-glow' : ''
                      }`}
                    >
                      {item.icon}
                    </div>

                    {/* Mobile-only text below icon */}
                    <div className="md:hidden mt-4 ml-0">
                      <p className="font-mono text-xs font-semibold text-gold/70 mb-1 tracking-widest">
                        STAGE {item.number}
                      </p>
                      <h3 className="font-display text-lg font-bold text-ivory mb-2 break-words flex items-center gap-1">
                        {item.stage}
                        <span className="text-gold text-sm">✦</span>
                      </h3>
                      <p className="text-muted text-sm break-words leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Right content (odd indices on desktop) */}
                  {!isEven && (
                    <div className="hidden md:block flex-1 pl-8">
                      <p className="font-mono text-xs font-semibold text-gold/70 letter-spaced-wider mb-1 tracking-widest">
                        STAGE {item.number}
                      </p>
                      <h3 className="font-display text-3xl font-bold text-ivory mb-3 break-words flex items-center gap-2">
                        <span className="text-gold text-xl">✦</span>
                        {item.stage}
                      </h3>
                      <p className="text-muted mb-0 break-words leading-relaxed">{item.description}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
