export function Footer() {
  return (
    <footer className="bg-card border-t border-stone/20 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-gold mb-4">
              Hajj Umrah Tours
            </h3>
            <p className="text-stone text-sm mb-4">
              Creating sacred journeys and transformative pilgrimage experiences since 2010.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-ink transition-all">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-ink transition-all">
                in
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-ink transition-all">
                @
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-ivory mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-ivory mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Hajj Packages
                </a>
              </li>
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Umrah Tours
                </a>
              </li>
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Spiritual Guidance
                </a>
              </li>
              <li>
                <a href="#" className="text-stone hover:text-gold transition-colors text-sm">
                  Visa Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-ivory mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <p className="text-sm text-stone">
                  <span className="text-gold">Phone:</span>
                  <br />
                  +1 (202) 555-1234
                </p>
              </li>
              <li>
                <p className="text-sm text-stone">
                  <span className="text-gold">Email:</span>
                  <br />
                  info@hajjumrahtours.com
                </p>
              </li>
              <li>
                <p className="text-sm text-stone">
                  <span className="text-gold">Hours:</span>
                  <br />
                  24/7 Support Available
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with star motif */}
        <div className="border-t border-stone/20 py-8">
          <div className="text-center text-stone text-sm">
            <p className="mb-3">✦ ✦ ✦</p>
            <p>
              © {new Date().getFullYear()} Hajj Umrah Tours. All rights reserved.
              <br />
              Made with reverence and care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
