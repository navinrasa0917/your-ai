"use client"

import Link from "next/link"
import { Heart, Phone, Mail, MapPin } from "lucide-react"
import { useTranslation } from "@/contexts/accessibility-context"

export function Footer() {
  const t = useTranslation()

  const quickLinks = [
    { href: "/schemes", label: t("schemes") },
    { href: "/jobs", label: t("jobs") },
    { href: "/sign-language", label: t("signLanguage") },
    { href: "/para-sports", label: t("paraSports") },
    { href: "/help", label: t("help") },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-xl font-bold text-primary-foreground">Y</span>
              </div>
              <span className="text-xl font-bold text-foreground">Your AI</span>
            </Link>
            <p className="mb-6 max-w-md text-muted-foreground">
              Empowering elderly people and persons with disabilities in India through AI-powered assistance. 
              Access government schemes, find jobs, and communicate with dignity.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Made with care for accessibility</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a href="mailto:help@yourai.in" className="hover:text-primary">help@yourai.in</a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 Your AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/accessibility-statement" className="text-sm text-muted-foreground hover:text-primary">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
