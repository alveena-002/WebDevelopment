'use client'

import { useState } from 'react'

export function ConciergeButton() {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { icon: '💬', label: 'WhatsApp Chat', action: 'https://wa.me/12025551234' },
    { icon: '📞', label: 'Call Now', action: 'tel:+12025551234' },
    { icon: '✉️', label: 'Email Us', action: 'mailto:concierge@hajjumrahtours.com' },
  ]

  return (
    <>
      {/* Expanded menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 animate-slide-up">
          <div className="flex flex-col gap-3">
            {options.map((option, idx) => (
              <a
                key={idx}
                href={option.action}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-card border border-gold/30 rounded-full text-ivory hover:border-gold hover:bg-gold hover:text-ink transition-all duration-300 shadow-xl"
              >
                <span className="text-xl">{option.icon}</span>
                <span className="font-semibold text-sm whitespace-nowrap">
                  {option.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-gold to-pomegranate text-ink flex items-center justify-center font-bold text-2xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
      >
        {isOpen ? '✕' : '?'}
      </button>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}
