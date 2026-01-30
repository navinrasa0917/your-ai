"use client"

import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignLanguageTranslator } from "@/components/sign-language-translator"

export default function SignLanguagePage() {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <SignLanguageTranslator />
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  )
}
