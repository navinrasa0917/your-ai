"use client"

import { useState } from "react"
import { Send, Mic, MicOff, Bot, User, FileText, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility, useTranslation } from "@/contexts/accessibility-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  schemes?: Scheme[]
}

interface Scheme {
  name: string
  description: string
  eligibility: string[]
  documents: string[]
  link: string
}

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Other"
]

const disabilityTypes = [
  "Visual Impairment",
  "Hearing Impairment",
  "Locomotor Disability",
  "Intellectual Disability",
  "Mental Illness",
  "Multiple Disabilities",
  "Elderly (60+)",
  "Other"
]

const sampleSchemes: Record<string, Scheme[]> = {
  "Visual Impairment": [
    {
      name: "Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP)",
      description: "Financial assistance for purchasing aids like white canes, Braille kits, and smart phones with accessibility features.",
      eligibility: ["40% or more disability", "Monthly income below Rs. 20,000", "Age above 5 years"],
      documents: ["Disability Certificate", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
      link: "https://disabilityaffairs.gov.in/content/page/adip.php"
    },
    {
      name: "Indira Gandhi National Disability Pension Scheme",
      description: "Monthly pension of Rs. 300 for persons with severe disabilities living below poverty line.",
      eligibility: ["Age 18-79 years", "80% or more disability", "BPL family"],
      documents: ["BPL Card", "Disability Certificate", "Aadhaar Card", "Bank Account"],
      link: "https://nsap.nic.in"
    }
  ],
  "Hearing Impairment": [
    {
      name: "Cochlear Implant Programme",
      description: "Free cochlear implant surgery and rehabilitation for children with hearing loss.",
      eligibility: ["Age below 5 years", "Profound hearing loss", "No other disabilities affecting speech"],
      documents: ["Audiometry Report", "Birth Certificate", "Aadhaar Card of Parent"],
      link: "https://disabilityaffairs.gov.in"
    },
    {
      name: "ADIP Scheme - Hearing Aids",
      description: "Free or subsidized digital hearing aids under ADIP scheme.",
      eligibility: ["40% or more hearing disability", "Annual income below Rs. 3 lakhs"],
      documents: ["Disability Certificate", "Income Certificate", "Aadhaar Card"],
      link: "https://disabilityaffairs.gov.in/content/page/adip.php"
    }
  ],
  "Locomotor Disability": [
    {
      name: "Free Distribution of Motorized Tricycles",
      description: "Motorized tricycles for persons with locomotor disability for mobility.",
      eligibility: ["80% or more locomotor disability", "Age 16-55 years", "Fit to drive"],
      documents: ["Disability Certificate", "Age Proof", "Fitness Certificate", "Driving ability test"],
      link: "https://disabilityaffairs.gov.in"
    },
    {
      name: "Deen Dayal Disabled Rehabilitation Scheme",
      description: "Grants to NGOs for rehabilitation services including mobility aids.",
      eligibility: ["Persons with 40% or more disability", "Registered with local NGO"],
      documents: ["Disability Certificate", "Aadhaar Card", "Photo"],
      link: "https://disabilityaffairs.gov.in/content/page/ddrs.php"
    }
  ],
  "Elderly (60+)": [
    {
      name: "Indira Gandhi National Old Age Pension Scheme",
      description: "Monthly pension for elderly persons living below poverty line.",
      eligibility: ["Age 60 years or above", "BPL family"],
      documents: ["Age Proof", "BPL Card", "Aadhaar Card", "Bank Account"],
      link: "https://nsap.nic.in"
    },
    {
      name: "Rashtriya Vayoshri Yojana",
      description: "Free distribution of living aids to senior citizens belonging to BPL category.",
      eligibility: ["Age 60 years or above", "BPL category", "Suffering from age-related disabilities"],
      documents: ["Age Proof", "BPL Certificate", "Aadhaar Card"],
      link: "https://socialjustice.nic.in"
    },
    {
      name: "Varishtha Pension Bima Yojana",
      description: "Pension scheme for senior citizens with guaranteed returns.",
      eligibility: ["Age 60 years or above", "Indian citizen"],
      documents: ["Age Proof", "Aadhaar Card", "PAN Card", "Bank Account"],
      link: "https://licindia.in"
    }
  ],
  default: [
    {
      name: "Unique Disability ID (UDID)",
      description: "National database for Persons with Disabilities with universal ID card for availing benefits.",
      eligibility: ["Any person with disability", "Indian citizen"],
      documents: ["Medical Certificate", "Aadhaar Card", "Photo", "Address Proof"],
      link: "https://swavlambancard.gov.in"
    },
    {
      name: "Accessible India Campaign",
      description: "Making public places, transport, and information accessible to persons with disabilities.",
      eligibility: ["All persons with disabilities"],
      documents: ["UDID Card for verification"],
      link: "https://accessibleindia.gov.in"
    }
  ]
}

export function SchemeAssistant() {
  const [step, setStep] = useState<"form" | "chat">("form")
  const [isListening, setIsListening] = useState(false)
  const [formData, setFormData] = useState({
    age: "",
    disabilityType: "",
    state: "",
    income: "",
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const { speak, voiceEnabled } = useAccessibility()
  const t = useTranslation()

  const handleFormSubmit = () => {
    const schemes = sampleSchemes[formData.disabilityType] || sampleSchemes.default
    const welcomeMessage = `Based on your profile, I found ${schemes.length} government schemes that may be relevant to you. Here are the details:`
    
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: welcomeMessage,
        schemes: schemes
      }
    ])
    
    if (voiceEnabled) {
      speak(welcomeMessage)
    }
    
    setStep("chat")
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    }
    
    const responseContent = getAssistantResponse(inputValue.toLowerCase())
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseContent
    }
    
    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInputValue("")
    
    if (voiceEnabled) {
      speak(responseContent)
    }
  }

  const getAssistantResponse = (query: string): string => {
    if (query.includes("document") || query.includes("paper")) {
      return "For most government schemes, you will need: 1) Disability Certificate from a certified medical authority, 2) Aadhaar Card, 3) Income Certificate, 4) Bank Account Details, and 5) Passport size photographs. Would you like help with getting any of these documents?"
    }
    if (query.includes("apply") || query.includes("application")) {
      return "You can apply for most schemes either online through the official government portals or offline at your nearest District Disability Rehabilitation Centre (DDRC). I recommend starting with getting your UDID (Unique Disability ID) as it simplifies the process for all other schemes."
    }
    if (query.includes("udid") || query.includes("disability id")) {
      return "UDID (Unique Disability ID) is a universal ID for persons with disabilities. You can apply online at swavlambancard.gov.in. Steps: 1) Register on the portal, 2) Fill the application form, 3) Book appointment for assessment, 4) Visit the hospital for evaluation, 5) Receive your UDID card. Need help with any specific step?"
    }
    if (query.includes("pension") || query.includes("money")) {
      return "For pension schemes, you may be eligible for: 1) Indira Gandhi National Disability Pension (Rs. 300/month for 80%+ disability), 2) State-specific disability pensions (amount varies by state). Would you like more details about pension schemes in your state?"
    }
    return "I can help you with information about government schemes, required documents, application process, and eligibility criteria. Please ask me anything specific, or I can guide you step-by-step through the application process for any scheme."
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here with Web Speech API
  }

  if (step === "form") {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{t("schemes")}</h1>
            <p className="text-lg text-muted-foreground">
              Answer a few simple questions to find government schemes you may be eligible for.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Tell Us About Yourself</CardTitle>
              <CardDescription>
                This information helps us find the right schemes for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-medium">
                  What is your age?
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12 text-lg"
                />
              </div>

              {/* Disability Type */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  What type of assistance do you need?
                </Label>
                <RadioGroup
                  value={formData.disabilityType}
                  onValueChange={(value) => setFormData({ ...formData, disabilityType: value })}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {disabilityTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <RadioGroupItem value={type} id={type} className="h-5 w-5" />
                      <Label htmlFor={type} className="cursor-pointer text-base">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-base font-medium">
                  Which state do you live in?
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger id="state" className="h-12 text-lg">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Income Category */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  What is your annual family income?
                </Label>
                <RadioGroup
                  value={formData.income}
                  onValueChange={(value) => setFormData({ ...formData, income: value })}
                  className="space-y-3"
                >
                  {[
                    { value: "bpl", label: "Below Poverty Line (BPL)" },
                    { value: "low", label: "Less than Rs. 2.5 Lakhs" },
                    { value: "medium", label: "Rs. 2.5 - 5 Lakhs" },
                    { value: "high", label: "Above Rs. 5 Lakhs" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} className="h-5 w-5" />
                      <Label htmlFor={option.value} className="cursor-pointer text-base">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={handleFormSubmit}
                className="h-14 w-full text-lg"
                disabled={!formData.age || !formData.disabilityType || !formData.state || !formData.income}
              >
                Find Schemes for Me
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Chat Header */}
        <div className="border-b border-border bg-primary/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Scheme Assistant</h2>
              <p className="text-sm text-muted-foreground">Ask me anything about government schemes</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto bg-transparent"
              onClick={() => setStep("form")}
            >
              Start Over
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxHeight: "calc(100vh - 400px)" }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  message.role === "user" ? "bg-primary" : "bg-muted"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Bot className="h-4 w-4 text-foreground" />
                )}
              </div>
              <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                <p
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </p>
                
                {/* Scheme Cards */}
                {message.schemes && (
                  <div className="mt-4 space-y-4">
                    {message.schemes.map((scheme, index) => (
                      <Card key={index} className="text-left">
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-3">
                            <FileText className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <CardTitle className="text-lg">{scheme.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-muted-foreground">{scheme.description}</p>
                          
                          <div>
                            <p className="mb-1 font-medium text-foreground">Eligibility:</p>
                            <ul className="space-y-1">
                              {scheme.eligibility.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="mb-1 font-medium text-foreground">Documents Required:</p>
                            <ul className="flex flex-wrap gap-2">
                              {scheme.documents.map((doc, i) => (
                                <li key={i} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button asChild variant="outline" size="sm" className="mt-2 bg-transparent">
                            <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                              Learn More & Apply
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Button
              variant={isListening ? "default" : "outline"}
              size="icon"
              onClick={toggleVoiceInput}
              className="h-12 w-12 shrink-0"
              aria-label={isListening ? "Stop voice input" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your question here..."
              className="h-12 text-lg"
            />
            <Button
              onClick={handleSendMessage}
              className="h-12 w-12 shrink-0"
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Ask about documents, application process, or any specific scheme
          </p>
        </div>
      </div>
    </div>
  )
}
