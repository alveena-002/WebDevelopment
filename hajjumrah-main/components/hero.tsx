'use client'

import { useEffect, useRef } from 'react'

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Draw 8-point star pattern
    const drawStarPattern = (x: number, y: number, size: number, opacity: number) => {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.strokeStyle = '#C9A227'
      ctx.lineWidth = 0.5
      ctx.translate(x, y)

      // 8-point star
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(cos * size, sin * size)
        ctx.stroke()
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.fillStyle = '#0B0D12'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw scattered star pattern
      for (let i = 0; i < 50; i++) {
        const x = (Math.random() * canvas.width)
        const y = Math.random() * (canvas.height * 0.4)
        const size = Math.random() * 20 + 10
        const opacity = Math.random() * 0.15 + 0.05
        drawStarPattern(x, y, size, opacity)
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Canvas background with star pattern */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Hero background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/makkah-skyline-dusk.png")',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-7xl md:text-8xl font-bold text-ivory mb-4 leading-tight">
            Sacred
            <br />
            <span className="text-gold">Journeys</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-stone max-w-2xl mx-auto">
            Experience the pilgrimage of a lifetime with luxury, care, and spiritual guidance
          </p>
        </div>

        {/* Rotating destination cities */}
        <div className="mt-12 flex justify-center items-center gap-8 flex-wrap">
          <div className="font-mono text-sm text-muted tracking-widest">
            ✦ Departing from New York
          </div>
          <div className="w-1 h-1 bg-gold rounded-full" />
          <div className="font-mono text-sm text-muted tracking-widest">
            London • Karachi • Lahore ✦
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-gold text-ink font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:shadow-xl">
            Start Your Journey
          </button>
          <button className="px-8 py-4 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-ink transition-all duration-300">
            Explore Packages
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  )
}
