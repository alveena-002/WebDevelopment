'use client'

import { useState } from 'react'

export function InquiryWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    travelers: '2',
    cabinClass: 'economy',
    hotelTier: 'premium',
    dates: 'flexible',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const steps = [
    {
      title: 'Personal Info',
      fields: ['name', 'email'],
    },
    {
      title: 'Travel Details',
      fields: ['travelers', 'cabinClass', 'dates'],
    },
    {
      title: 'Preferences',
      fields: ['hotelTier'],
    },
  ]

  const currentStep = steps[step - 1]

  return (
    <section className="py-24 px-6 bg-card">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-ivory mb-4">
            Personalized
            <br />
            <span className="text-gold">Inquiry</span>
          </h2>
          <p className="font-body text-lg text-stone">
            Tell us about your pilgrimage dreams and receive a custom quote
          </p>
        </div>

        {/* Progress bar with star motif */}
        <div className="mb-12">
          <div className="flex justify-between mb-8">
            {steps.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-display text-lg font-bold transition-all duration-300 ${
                    step > idx
                      ? 'bg-gold text-ink shadow-lg shadow-gold/50'
                      : step === idx + 1
                        ? 'bg-gold text-ink scale-110 shadow-xl shadow-gold/50'
                        : 'bg-stone/20 text-stone'
                  }`}
                >
                  ✦
                </div>
                <p className="text-xs font-mono text-stone mt-2 text-center">{s.title}</p>
              </div>
            ))}
          </div>

          {/* Progress line */}
          <div className="w-full h-0.5 bg-stone/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-pomegranate transition-all duration-500"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-ink p-8 rounded-xl border border-stone/20">
          <h3 className="font-display text-2xl font-bold text-ivory mb-6">
            {currentStep.title}
          </h3>

          <div className="space-y-6">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2 break-words">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-card border border-stone/30 rounded-lg text-ivory placeholder-muted focus:border-gold focus:outline-none transition-colors break-words"
                  />
                </div>
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2 break-words">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-card border border-stone/30 rounded-lg text-ivory placeholder-muted focus:border-gold focus:outline-none transition-colors break-words"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Travel Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2">
                    Number of Travelers
                  </label>
                  <select
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-stone/30 rounded-lg text-ivory focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3-4 people</option>
                    <option value="5">5+ people</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2">
                    Cabin Class
                  </label>
                  <select
                    name="cabinClass"
                    value={formData.cabinClass}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-stone/30 rounded-lg text-ivory focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2">
                    Travel Dates
                  </label>
                  <select
                    name="dates"
                    value={formData.dates}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-stone/30 rounded-lg text-ivory focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="q1">Q1 2025</option>
                    <option value="q2">Q2 2025</option>
                    <option value="q3">Q3 2025</option>
                    <option value="q4">Q4 2025</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2">
                    Hotel Preference
                  </label>
                  <select
                    name="hotelTier"
                    value={formData.hotelTier}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-card border border-stone/30 rounded-lg text-ivory focus:border-gold focus:outline-none transition-colors"
                  >
                    <option value="budget">Budget 3-Star</option>
                    <option value="standard">Standard 4-Star</option>
                    <option value="premium">Premium 4-Star</option>
                    <option value="luxury">Luxury 5-Star</option>
                  </select>
                </div>
                <div className="bg-card p-4 rounded-lg border border-gold/20">
                  <p className="text-ivory text-sm break-words">
                    <span className="text-gold font-semibold">✓ Ready to submit?</span>
                    <br />
                    Click &quot;Get Quote&quot; to receive a personalized proposal based on your preferences.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex-1 px-6 py-3 border border-stone/30 text-stone font-semibold rounded-lg hover:border-gold hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {step < steps.length ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 px-6 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors"
              >
                Next
              </button>
            ) : (
              <button className="flex-1 px-6 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors">
                Get My Quote
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
