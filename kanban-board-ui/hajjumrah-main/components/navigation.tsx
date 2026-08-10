'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      submenu: null,
    },
    {
      label: 'About',
      href: '/about',
      submenu: null,
    },
    {
      label: 'Services',
      href: '#',
      submenu: [
        { label: 'Hajj Packages', href: '/packages' },
        { label: 'Umrah Packages', href: '/packages?type=umrah' },
        { label: 'Hotels', href: '/hotels' },
        { label: 'Transportation', href: '/hotels#transportation' },
      ],
    },
    {
      label: 'Gallery',
      href: '/gallery',
      submenu: null,
    },
    {
      label: 'Contact',
      href: '/contact',
      submenu: null,
    },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center">
                <span className="text-ink font-display font-bold text-lg">H</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-ivory text-lg">Hajj Tours</p>
                <p className="text-gold text-xs">Sacred Journeys</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  className="px-4 py-2 text-ivory hover:text-gold transition-colors flex items-center gap-1 rounded-lg group-hover:bg-white/5"
                >
                  <Link href={item.href} className="flex items-center gap-1">
                    {item.label}
                    {item.submenu && (
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                </button>

                {/* Dropdown Menu */}
                {item.submenu && (
                  <div className="absolute left-0 mt-0 w-48 bg-card border border-gold/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className="block px-4 py-2 text-ivory hover:bg-gold/10 hover:text-gold transition-colors text-sm break-words"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-6 py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-ivory hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => item.submenu && toggleDropdown(item.label)}
                  className="w-full text-left px-4 py-2 text-ivory hover:text-gold hover:bg-white/5 rounded-lg flex items-center justify-between transition-colors break-words"
                >
                  <Link href={item.href} className="flex-grow">
                    {item.label}
                  </Link>
                  {item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Mobile Submenu */}
                {item.submenu && openDropdown === item.label && (
                  <div className="pl-4 space-y-1 mt-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        className="block px-4 py-2 text-gold hover:bg-gold/10 rounded-lg text-sm break-words"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/contact"
              className="block px-4 py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-gold/90 transition-colors text-center mt-4"
            >
              Get Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
