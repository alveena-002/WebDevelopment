'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - integrate with email service
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '[INSERT: Phone number]',
      detail: '[INSERT: Available hours]',
    },
    {
      icon: Mail,
      label: 'Email',
      value: '[INSERT: Email address]',
      detail: '[INSERT: Response time]',
    },
    {
      icon: MapPin,
      label: 'Office',
      value: '[INSERT: City/Country]',
      detail: '[INSERT: Full address]',
    },
    {
      icon: Clock,
      label: 'Hours',
      value: '[INSERT: Days]',
      detail: '[INSERT: Time zone and hours]',
    },
  ]

  return (
    <main className="bg-background text-foreground pt-20 pb-12">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-ivory mb-6 text-balance">
          Get in Touch
        </h1>
        <p className="text-xl text-stone max-w-2xl mx-auto text-balance break-words">
          Have questions about our packages? Ready to start your pilgrimage? We&apos;re here to help.
        </p>
      </section>

      {/* Contact Info Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon
            return (
              <div key={idx} className="p-6 rounded-xl bg-card border border-gold/20 hover:border-gold/50 transition-all">
                <Icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-display text-lg font-bold text-ivory mb-2 break-words">{info.label}</h3>
                <p className="text-gold font-semibold text-sm mb-1 break-words">{info.value}</p>
                <p className="text-stone text-sm break-words">{info.detail}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-16">
        <div className="p-8 rounded-xl bg-card border border-gold/20">
          <h2 className="font-display text-3xl font-bold text-ivory mb-8 text-center">Send us a Message</h2>

          {submitted ? (
            <div className="p-6 bg-gold/10 border border-gold rounded-lg text-center">
              <p className="text-gold font-semibold text-lg mb-2">Thank you!</p>
              <p className="text-stone break-words">
                Your message has been received. We&apos;ll get back to you within [INSERT: response time].
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-stone text-sm font-semibold mb-2 break-words">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-input border border-stone/30 rounded-lg text-ivory placeholder-muted focus:border-gold focus:outline-none transition-colors break-words"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2 break-words">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-input border border-stone/30 rounded-lg text-ivory placeholder-muted focus:border-gold focus:outline-none transition-colors break-words"
                  />
                </div>
                <div>
                  <label className="block text-stone text-sm font-semibold mb-2 break-words">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (000) 000-0000"
                    className="w-full px-4 py-3 bg-input border border-stone/30 rounded-lg text-ivory placeholder-muted focus:border-gold focus:outline-none transition-colors break-words"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-stone text-sm font-semibold mb-2 break-words">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-input border border-stone/30 rounded-lg text-ivory focus:border-gold focus:outline-none transition-colors break-words"
                >
                  <option value="">Select a subject...</option>
                  <option value="hajj-inquiry">Hajj Package Inquiry</option>
                  <option value="umrah-inquiry">Umrah Package Inquiry</option>
                  <option value="hotel-transport">Hotel & Transportation</option>
                  <option value="custom">Custom Package</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-stone text-sm font-semibold mb-2 break-words">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your pilgrimage journey..."
                  rows={6}
                  className="w-full px-4 py-3 bg-input border border-stone/30 rounded-lg text-ivory placeholder-muted focus:border-gold focus:outline-none transition-colors resize-none break-words"
                />
              </div>

              {/* Privacy Note */}
              <div className="p-4 bg-black/20 rounded-lg">
                <p className="text-stone text-xs break-words">
                  [INSERT: Privacy policy statement and data handling information]
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gold text-ink font-bold rounded-lg hover:bg-gold/90 transition-colors text-lg"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Live Chat / Concierge */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-gold/10 to-pomegranate/10 border border-gold/20 rounded-xl p-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ivory mb-4 break-words">Prefer to Chat?</h2>
          <p className="text-stone mb-6 break-words">
            [INSERT: Information about live chat availability, WhatsApp support, or other instant communication options]
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/[INSERT_WHATSAPP_NUMBER]"
              className="px-6 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            >
              WhatsApp Support
            </a>
            <a
              href="tel:[INSERT_PHONE]"
              className="px-6 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
