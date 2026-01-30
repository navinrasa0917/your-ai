"use client"

import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ParaSportsSection } from "@/components/para-sports-section"

export default function ParaSportsPage() {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <ParaSportsSection />
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  )
}
