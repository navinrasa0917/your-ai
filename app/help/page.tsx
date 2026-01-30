"use client"

import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HelpSection } from "@/components/help-section"

export default function HelpPage() {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <HelpSection />
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  )
}
