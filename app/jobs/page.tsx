"use client"

import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobMatcher } from "@/components/job-matcher"

export default function JobsPage() {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <JobMatcher />
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  )
}
