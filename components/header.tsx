"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Volume2, VolumeX, Sun, Moon, Type, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAccessibility, useTranslation } from "@/contexts/accessibility-context"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const {
    language,
    setLanguage,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    voiceEnabled,
    setVoiceEnabled,
  } = useAccessibility()
  const t = useTranslation()

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/schemes", label: t("schemes") },
    { href: "/jobs", label: t("jobs") },
    { href: "/sign-language", label: t("signLanguage") },
    { href: "/para-sports", label: t("paraSports") },
    { href: "/help", label: t("help") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Your AI Home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-xl font-bold text-primary-foreground">Y</span>
          </div>
          <span className="text-xl font-bold text-foreground">Your AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Accessibility Controls */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Voice Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            aria-label={voiceEnabled ? "Disable voice support" : "Enable voice support"}
            className="h-10 w-10"
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>

          {/* High Contrast Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHighContrast(!highContrast)}
            aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
            className="h-10 w-10"
          >
            {highContrast ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Font Size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Change text size">
                <Type className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFontSize("normal")}>
                <span className={fontSize === "normal" ? "font-bold" : ""}>Normal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize("large")}>
                <span className={fontSize === "large" ? "font-bold" : ""}>Large</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize("xlarge")}>
                <span className={fontSize === "xlarge" ? "font-bold" : ""}>Extra Large</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 px-3 bg-transparent" aria-label="Select language">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{language}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                <span className={language === "en" ? "font-bold" : ""}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("hi")}>
                <span className={language === "hi" ? "font-bold" : ""}>हिंदी (Hindi)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ta")}>
                <span className={language === "ta" ? "font-bold" : ""}>தமிழ் (Tamil)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-foreground hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Accessibility Controls */}
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-3 px-4 text-sm font-semibold text-muted-foreground">{t("accessibility")}</p>
              
              <div className="flex flex-wrap gap-2 px-4">
                <Button
                  variant={voiceEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="gap-2"
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {t("voiceSupport")}
                </Button>
                
                <Button
                  variant={highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHighContrast(!highContrast)}
                  className="gap-2"
                >
                  {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {t("highContrastMode")}
                </Button>
              </div>
              
              <div className="mt-3 flex gap-2 px-4">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                >
                  EN
                </Button>
                <Button
                  variant={language === "hi" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("hi")}
                >
                  हिं
                </Button>
                <Button
                  variant={language === "ta" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("ta")}
                >
                  த
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
