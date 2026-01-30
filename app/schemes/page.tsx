"use client"

import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SchemeAssistant } from "@/components/scheme-assistant"

export default function SchemesPage() {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <SchemeAssistant />
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  )
}
