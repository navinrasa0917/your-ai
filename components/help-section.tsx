"use client"

import React from "react"

import { useState } from "react"
import { Phone, Mail, MessageCircle, HelpCircle, FileText, Video, Book, ExternalLink, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/contexts/accessibility-context"

const faqs = [
  {
    question: "How do I apply for a disability certificate (UDID)?",
    answer: "You can apply for UDID online at swavlambancard.gov.in. Steps: 1) Register with your Aadhaar number, 2) Fill the application form, 3) Book an appointment at your nearest assessment center, 4) Visit for medical assessment, 5) Receive your UDID card within 30 days. You can also visit your nearest District Disability Rehabilitation Centre (DDRC) for offline application."
  },
  {
    question: "What documents do I need for government scheme applications?",
    answer: "Common documents required are: 1) UDID Card or Disability Certificate (40% or more), 2) Aadhaar Card, 3) Income Certificate from Tehsildar, 4) Bank Account Passbook, 5) Passport size photographs, 6) Residence Proof. Some schemes may require additional documents based on eligibility criteria."
  },
  {
    question: "Can elderly people without disabilities use this platform?",
    answer: "Yes! Your AI is designed for both elderly citizens and persons with disabilities. We have specific schemes and support services for senior citizens aged 60 and above, regardless of disability status. Use our AI Scheme Assistant to find relevant programs."
  },
  {
    question: "How does the Sign Language Translator work?",
    answer: "Our Sign Language Translator uses your device camera to recognize Indian Sign Language (ISL) gestures. It converts these gestures into text and voice output in English, Hindi, or Tamil. For best results, ensure good lighting, position your hands clearly in front of the camera, and make gestures slowly."
  },
  {
    question: "Are the job listings verified?",
    answer: "Yes, we partner with verified employers who have committed to providing accessible workplaces and reasonable accommodations for persons with disabilities. All job listings are checked for authenticity and accessibility compliance before being displayed."
  },
  {
    question: "Is there any cost to use Your AI?",
    answer: "No, Your AI is completely free to use. Our mission is to provide accessible assistance to all citizens. There are no hidden charges for using any feature including the AI Assistant, Job Matching, Sign Language Translator, or Para Sports information."
  },
  {
    question: "How do I change the language?",
    answer: "You can change the language using the language selector in the navigation bar. Click on the globe icon or the language code (EN/HI/TA) and select your preferred language. The entire interface will update to your chosen language - English, Hindi, or Tamil."
  },
  {
    question: "What if I need help using the website?",
    answer: "You can enable Voice Support from the accessibility menu to have content read aloud. You can also enable High Contrast mode for better visibility, increase text size, or contact us directly through phone (toll-free), email, or the contact form below."
  }
]

const resources = [
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides on using each feature",
    icon: Video,
    items: [
      "How to use AI Scheme Assistant",
      "Finding jobs on Your AI",
      "Using Sign Language Translator",
      "Registering for Para Sports"
    ]
  },
  {
    title: "Document Guides",
    description: "Downloadable guides for applications",
    icon: FileText,
    items: [
      "UDID Application Guide",
      "Scheme Document Checklist",
      "Job Application Tips",
      "Para Sports Registration Form"
    ]
  },
  {
    title: "Knowledge Base",
    description: "Articles and information resources",
    icon: Book,
    items: [
      "Understanding Disability Categories",
      "Rights of Persons with Disabilities Act",
      "Accessible India Campaign",
      "Para Sports in India"
    ]
  }
]

const contactMethods = [
  {
    title: "Toll-Free Helpline",
    description: "Call us for immediate assistance",
    value: "1800-XXX-XXXX",
    icon: Phone,
    availability: "Available 24/7 in English, Hindi, Tamil"
  },
  {
    title: "Email Support",
    description: "Send us your queries",
    value: "help@yourai.in",
    icon: Mail,
    availability: "Response within 24 hours"
  },
  {
    title: "WhatsApp Support",
    description: "Chat with us on WhatsApp",
    value: "+91 98XXX XXXXX",
    icon: MessageCircle,
    availability: "Mon-Sat, 9 AM - 6 PM"
  }
]

export function HelpSection() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const t = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 5000)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">{t("help")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get help with using Your AI, find answers to common questions, 
            or contact our support team for assistance.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <Card key={method.title} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-foreground">{method.title}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{method.description}</p>
                  <p className="mb-2 text-lg font-medium text-primary">{method.value}</p>
                  <p className="text-xs text-muted-foreground">{method.availability}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* FAQ Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to common questions about Your AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  Send us a message and we will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We will respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What do you need help with?"
                        required
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your issue or question in detail..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full gap-2" size="lg">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Helpful Resources</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon
              return (
                <Card key={resource.title}>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resource.items.map((item, i) => (
                        <li key={i}>
                          <a 
                            href="#" 
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Emergency Numbers */}
        <Card className="mt-12 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Important Helpline Numbers</CardTitle>
            <CardDescription>
              Emergency and government helpline numbers for immediate assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "National Disability Helpline", number: "1800-121-1122" },
                { name: "Senior Citizens Helpline", number: "14567" },
                { name: "Women Helpline", number: "181" },
                { name: "Mental Health Helpline", number: "1800-599-0019" },
              ].map((helpline) => (
                <div key={helpline.name} className="rounded-lg bg-card p-4 text-center">
                  <p className="mb-1 text-sm font-medium text-muted-foreground">{helpline.name}</p>
                  <p className="text-xl font-bold text-primary">{helpline.number}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
