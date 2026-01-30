"use client"

import { useState } from "react"
import { Trophy, MapPin, Calendar, Users, CheckCircle, ArrowRight, Medal, Target, Heart, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "@/contexts/accessibility-context"

interface Sport {
  name: string
  description: string
  eligibility: string[]
  equipment: string
  classification: string
}

interface TrainingCenter {
  name: string
  location: string
  sports: string[]
  contact: string
  website: string
}

const paraSports: Sport[] = [
  {
    name: "Para Athletics",
    description: "Track and field events adapted for athletes with physical, visual, or intellectual impairments. Includes running, jumping, and throwing events.",
    eligibility: ["Physical impairment", "Visual impairment", "Intellectual impairment"],
    equipment: "Racing wheelchairs, prosthetics, guide runners for visually impaired",
    classification: "T/F 11-13 (Visual), T/F 20 (Intellectual), T/F 31-38 (Coordination), T/F 40-47 (Short stature/limb deficiency), T/F 51-57 (Wheelchair)"
  },
  {
    name: "Para Swimming",
    description: "Swimming competitions with classifications based on the impact of impairment on swimming strokes.",
    eligibility: ["Physical impairment", "Visual impairment", "Intellectual impairment"],
    equipment: "Standard swimming gear, specialized starting blocks",
    classification: "S1-S10 (Physical), S11-S13 (Visual), S14 (Intellectual)"
  },
  {
    name: "Para Badminton",
    description: "Badminton adapted for players with physical impairments. Includes wheelchair and standing categories.",
    eligibility: ["Wheelchair users", "Standing with lower limb impairment", "Short stature"],
    equipment: "Standard badminton equipment, sports wheelchairs",
    classification: "WH1-WH2 (Wheelchair), SL3-SL4 (Standing Lower), SU5 (Standing Upper), SS6 (Short Stature)"
  },
  {
    name: "Para Archery",
    description: "Archery for athletes who compete either standing or from a wheelchair.",
    eligibility: ["Physical impairment affecting limbs", "Wheelchair users"],
    equipment: "Bows, arrows, mouth tabs, release aids, wheelchairs",
    classification: "Open (Wheelchair), Standing"
  },
  {
    name: "Para Powerlifting",
    description: "Bench press competition for athletes with lower limb impairments.",
    eligibility: ["Lower limb impairment", "Hip joint impairment"],
    equipment: "Bench, competition bar and weights",
    classification: "Based on body weight categories"
  },
  {
    name: "Wheelchair Basketball",
    description: "Basketball played by athletes who use wheelchairs due to lower limb disabilities.",
    eligibility: ["Lower limb impairment preventing running"],
    equipment: "Sports wheelchair, basketball",
    classification: "1.0-4.5 points based on functional ability"
  },
  {
    name: "Goalball",
    description: "Team sport specifically designed for athletes with visual impairment. Players throw a ball with bells inside.",
    eligibility: ["Visual impairment only"],
    equipment: "Goalball, eyeshades, goal posts",
    classification: "All players wear eyeshades for fair competition"
  },
  {
    name: "Blind Cricket",
    description: "Cricket adapted for visually impaired players with audio ball and larger wickets.",
    eligibility: ["Total blindness (B1)", "Partial sight (B2, B3)"],
    equipment: "Audio ball with bells, larger stumps",
    classification: "B1 (Totally blind), B2 (Partially sighted), B3 (Partially sighted)"
  }
]

const trainingCenters: TrainingCenter[] = [
  {
    name: "SAI National Centre of Excellence",
    location: "Bengaluru, Karnataka",
    sports: ["Para Athletics", "Para Swimming", "Para Badminton"],
    contact: "080-2232 5555",
    website: "https://saiindia.nic.in"
  },
  {
    name: "Shri Shiv Chhatrapati Sports Complex",
    location: "Pune, Maharashtra",
    sports: ["Para Athletics", "Wheelchair Basketball"],
    contact: "020-2567 2345",
    website: "https://maha-sports.gov.in"
  },
  {
    name: "Indira Gandhi Stadium Complex",
    location: "New Delhi",
    sports: ["Para Badminton", "Para Athletics", "Goalball"],
    contact: "011-2337 2345",
    website: "https://delhisportscouncil.in"
  },
  {
    name: "Jawaharlal Nehru Stadium",
    location: "Chennai, Tamil Nadu",
    sports: ["Para Athletics", "Blind Cricket"],
    contact: "044-2534 5678",
    website: "https://sdat.tn.gov.in"
  },
  {
    name: "Salt Lake Stadium Training Center",
    location: "Kolkata, West Bengal",
    sports: ["Para Athletics", "Para Swimming"],
    contact: "033-2358 9012",
    website: "https://wbsports.gov.in"
  }
]

const registrationSteps = [
  {
    step: 1,
    title: "Get Your Disability Certificate",
    description: "Obtain a disability certificate (UDID) from your nearest district hospital or medical board.",
    documents: ["Medical reports", "ID proof", "Address proof", "Passport photos"]
  },
  {
    step: 2,
    title: "National Classification",
    description: "Undergo sports classification by a certified classifier to determine your competition category.",
    documents: ["Disability certificate", "Medical history", "Previous sports records (if any)"]
  },
  {
    step: 3,
    title: "Register with State Association",
    description: "Register with your state's para-sports association affiliated with Paralympic Committee of India.",
    documents: ["Classification certificate", "Aadhaar card", "Photos", "Registration fee"]
  },
  {
    step: 4,
    title: "Participate in State Events",
    description: "Compete in state-level championships to qualify for national events.",
    documents: ["State registration card", "Medical fitness certificate"]
  },
  {
    step: 5,
    title: "National Championships",
    description: "Top performers from state events qualify for national championships and international selection.",
    documents: ["National registration", "Performance records"]
  }
]

const supportSchemes = [
  {
    name: "Khelo India Para Games",
    description: "Government initiative providing training, equipment, and financial support to para athletes.",
    benefits: ["Monthly stipend", "Training facilities", "Equipment support", "Coaching"],
    link: "https://kheloindia.gov.in"
  },
  {
    name: "Paralympic Committee of India Support",
    description: "Official support programs for registered para athletes.",
    benefits: ["International exposure", "Classification support", "Technical training"],
    link: "https://paralympicindia.org.in"
  },
  {
    name: "State Sports Pension",
    description: "Monthly pension for medal-winning para athletes in national/international events.",
    benefits: ["Monthly pension Rs. 5,000 - 50,000", "Medical support", "Travel allowance"],
    link: "Contact your state sports department"
  },
  {
    name: "TOPS (Target Olympic Podium Scheme)",
    description: "Elite support program for athletes with medal potential at Paralympics.",
    benefits: ["World-class coaching", "International training", "Full financial support"],
    link: "https://sportsauthorityofindia.nic.in/tops"
  }
]

export function ParaSportsSection() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null)
  const t = useTranslation()

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">{t("paraSports")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover para-sports opportunities, find training centers, and learn how to register 
            for Paralympic competitions in India.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Medal, label: "Paralympic Sports", value: "22+" },
            { icon: Users, label: "Indian Para Athletes", value: "5000+" },
            { icon: Trophy, label: "Paralympic Medals", value: "30+" },
            { icon: Building, label: "Training Centers", value: "50+" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="text-center">
                <CardContent className="p-6">
                  <Icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="sports" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sports" className="text-sm">Sports</TabsTrigger>
            <TabsTrigger value="centers" className="text-sm">Training Centers</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">How to Register</TabsTrigger>
            <TabsTrigger value="support" className="text-sm">Support Schemes</TabsTrigger>
          </TabsList>

          {/* Sports Tab */}
          <TabsContent value="sports" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paraSports.map((sport) => (
                <Card 
                  key={sport.name}
                  className="cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => setSelectedSport(sport)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-primary" />
                      {sport.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {sport.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sport.eligibility.slice(0, 2).map((item, i) => (
                        <span key={i} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                          {item}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sport Detail Modal */}
            {selectedSport && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{selectedSport.name}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSport(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedSport.description}</p>
                  
                  <div>
                    <p className="mb-2 font-medium">Eligibility:</p>
                    <ul className="space-y-1">
                      {selectedSport.eligibility.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Equipment:</p>
                    <p className="text-muted-foreground">{selectedSport.equipment}</p>
                  </div>
                  
                  <div>
                    <p className="mb-2 font-medium">Classification:</p>
                    <p className="text-muted-foreground">{selectedSport.classification}</p>
                  </div>
                  
                  <Button className="gap-2">
                    Find Training Centers
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Training Centers Tab */}
          <TabsContent value="centers" className="space-y-4">
            {trainingCenters.map((center) => (
              <Card key={center.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{center.name}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {center.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Sports Available:</p>
                    <div className="flex flex-wrap gap-2">
                      {center.sports.map((sport, i) => (
                        <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Contact: {center.contact}</span>
                    <a 
                      href={center.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>How to Register for Para Sports</CardTitle>
                <CardDescription>
                  Follow these steps to begin your journey as a para athlete in India.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {registrationSteps.map((step, index) => (
                    <div key={step.step} className="relative flex gap-4">
                      {/* Connector Line */}
                      {index < registrationSteps.length - 1 && (
                        <div className="absolute left-5 top-12 h-[calc(100%-24px)] w-0.5 bg-border" />
                      )}
                      
                      {/* Step Number */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {step.step}
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 pb-6">
                        <h3 className="mb-1 text-lg font-semibold text-foreground">{step.title}</h3>
                        <p className="mb-3 text-muted-foreground">{step.description}</p>
                        <div>
                          <p className="mb-2 text-sm font-medium">Documents Required:</p>
                          <ul className="flex flex-wrap gap-2">
                            {step.documents.map((doc, i) => (
                              <li key={i} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Schemes Tab */}
          <TabsContent value="support" className="space-y-4">
            {supportSchemes.map((scheme) => (
              <Card key={scheme.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    {scheme.name}
                  </CardTitle>
                  <CardDescription>{scheme.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 font-medium">Benefits:</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {scheme.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button asChild variant="outline" className="gap-2 bg-transparent">
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Who can participate in para sports?</AccordionTrigger>
                <AccordionContent>
                  Anyone with a permanent physical, visual, or intellectual impairment can participate 
                  in para sports. You need to have a valid disability certificate and undergo sports 
                  classification to determine your eligible category.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is there an age limit for para sports?</AccordionTrigger>
                <AccordionContent>
                  There is no upper age limit for most para sports. Many athletes start their careers 
                  later in life. However, some youth programs have specific age requirements. It is never 
                  too late to start your para-sports journey!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How much does it cost to train?</AccordionTrigger>
                <AccordionContent>
                  Many government-supported training centers offer free or subsidized training for 
                  para athletes. Equipment support is also available through various government schemes. 
                  Contact your state sports association for details about available support.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I qualify for Paralympics?</AccordionTrigger>
                <AccordionContent>
                  To qualify for Paralympics, you need to: 1) Get classified by IPC-certified classifiers, 
                  2) Compete in national and international events, 3) Meet the minimum qualifying standards 
                  set by the International Paralympic Committee, 4) Be selected by Paralympic Committee of India.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
