"use client"

import Link from "next/link"
import { FileText, Briefcase, Hand, Trophy, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/contexts/accessibility-context"

const features = [
  {
    icon: FileText,
    titleKey: "schemeTitle",
    descKey: "schemeDesc",
    href: "/schemes",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Briefcase,
    titleKey: "jobTitle",
    descKey: "jobDesc",
    href: "/jobs",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Hand,
    titleKey: "signTitle",
    descKey: "signDesc",
    href: "/sign-language",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Trophy,
    titleKey: "sportsTitle",
    descKey: "sportsDesc",
    href: "/para-sports",
    color: "bg-primary/10 text-primary",
  },
]

export function FeaturesSection() {
  const t = useTranslation()

  return (
    <section 
      className="bg-muted/50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 
            id="features-heading"
            className="mb-4 text-balance text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t("featuresTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our AI-powered tools are designed to be simple, accessible, and helpful for everyone.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card 
                key={feature.titleKey}
                className="group relative overflow-hidden transition-all hover:shadow-lg focus-within:ring-2 focus-within:ring-primary"
              >
                <CardHeader>
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{t(feature.titleKey)}</CardTitle>
                  <CardDescription className="text-base">
                    {t(feature.descKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="group/btn -ml-2 gap-2 text-primary">
                    <Link href={feature.href}>
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
