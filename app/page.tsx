"use client"

import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          
          {/* How It Works Section */}
          <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="how-it-works">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 id="how-it-works" className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                  Simple Steps to Get Help
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Our process is designed to be easy and accessible for everyone.
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Tell Us About Yourself",
                    description: "Share your basic details like age, location, and any specific needs you have.",
                  },
                  {
                    step: "2",
                    title: "Get AI Recommendations",
                    description: "Our AI analyzes your information and suggests relevant schemes, jobs, or resources.",
                  },
                  {
                    step: "3",
                    title: "Apply with Guidance",
                    description: "Follow our step-by-step guidance to apply for benefits or opportunities.",
                  },
                ].map((item) => (
                  <div 
                    key={item.step}
                    className="relative rounded-2xl border border-border bg-card p-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Trust Section */}
          <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-primary-foreground sm:text-4xl">
                Built for Accessibility, Designed with Care
              </h2>
              <p className="mb-8 text-lg text-primary-foreground/90">
                Every feature of Your AI is built with accessibility at its core. 
                We support multiple languages, voice navigation, high contrast mode, 
                and sign language translation to ensure everyone can use our platform with ease.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {["Voice Support", "Multi-Language", "High Contrast", "Large Text", "Keyboard Navigation"].map((feature) => (
                  <span 
                    key={feature}
                    className="rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </AccessibilityProvider>
  )
}
