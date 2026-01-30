"use client"

import Link from "next/link"
import { ArrowRight, Heart, Users, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccessibility, useTranslation } from "@/contexts/accessibility-context"

export function HeroSection() {
  const { speak, voiceEnabled } = useAccessibility()
  const t = useTranslation()

  const handleSpeak = () => {
    if (voiceEnabled) {
      speak(`${t("welcome")}. ${t("tagline")}. ${t("mission")}`)
    }
  }

  return (
    <section 
      className="relative overflow-hidden bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-accent/10" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span>Accessible AI for Everyone</span>
            </div>
            
            <h1 
              id="hero-heading"
              className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {t("welcome")}
            </h1>
            
            <p className="mb-4 text-xl font-medium text-primary sm:text-2xl">
              {t("tagline")}
            </p>
            
            <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("mission")}
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                className="h-14 px-8 text-lg"
                onClick={handleSpeak}
              >
                <Link href="/schemes">
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg bg-transparent"
              >
                <Link href="/help">
                  {t("learnMore")}
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Government Schemes</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Jobs Listed</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">Languages</p>
              </div>
            </div>
          </div>
          
          {/* Illustration */}
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
              <div className="grid h-full grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow-lg">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-center text-sm font-medium text-foreground">Elderly Support</p>
                </div>
                
                {/* Card 2 */}
                <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow-lg">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20">
                    <HandHeart className="h-7 w-7 text-accent" aria-hidden="true" />
                  </div>
                  <p className="text-center text-sm font-medium text-foreground">Disability Aid</p>
                </div>
                
                {/* Card 3 - Spanning */}
                <div className="col-span-2 flex items-center justify-center rounded-2xl bg-primary p-6 shadow-lg">
                  <div className="text-center">
                    <p className="mb-2 text-2xl font-bold text-primary-foreground">AI-Powered</p>
                    <p className="text-sm text-primary-foreground/80">Simple, Accessible, Inclusive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
