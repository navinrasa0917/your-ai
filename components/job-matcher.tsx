"use client"

import { useState } from "react"
import { Search, MapPin, Briefcase, Clock, CheckCircle, Building2, Home, ArrowRight, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/contexts/accessibility-context"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Remote" | "On-site" | "Hybrid"
  salary: string
  accessibility: string[]
  skills: string[]
  description: string
  posted: string
}

const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Customer Support Executive",
    company: "TechServe India",
    location: "Mumbai, Maharashtra",
    type: "Remote",
    salary: "Rs. 2.5 - 4 LPA",
    accessibility: ["Screen reader compatible", "Flexible hours", "Work from home"],
    skills: ["Communication", "Hindi", "English", "Computer basics"],
    description: "Handle customer queries via chat and email. Training provided. Accessible workplace with assistive technology support.",
    posted: "2 days ago"
  },
  {
    id: "2",
    title: "Data Entry Operator",
    company: "GovTech Solutions",
    location: "Delhi",
    type: "Hybrid",
    salary: "Rs. 1.8 - 2.5 LPA",
    accessibility: ["Wheelchair accessible", "Flexible timings", "Accessible restrooms"],
    skills: ["Typing", "MS Office", "Attention to detail"],
    description: "Enter and verify data in government databases. Fully accessible office with ramps and elevators.",
    posted: "1 week ago"
  },
  {
    id: "3",
    title: "Content Writer (Hindi/English)",
    company: "Digital Media Co.",
    location: "Bangalore, Karnataka",
    type: "Remote",
    salary: "Rs. 3 - 5 LPA",
    accessibility: ["Fully remote", "Flexible deadlines", "Voice-to-text tools provided"],
    skills: ["Writing", "Hindi", "English", "Research"],
    description: "Write articles and content for websites. Work entirely from home with your own schedule.",
    posted: "3 days ago"
  },
  {
    id: "4",
    title: "Telephone Counselor",
    company: "Mental Health Helpline",
    location: "Chennai, Tamil Nadu",
    type: "Remote",
    salary: "Rs. 2 - 3 LPA",
    accessibility: ["Audio-based work", "Work from home", "Training provided"],
    skills: ["Active listening", "Empathy", "Tamil", "English"],
    description: "Provide support and guidance over phone calls. Ideal for persons with visual impairment. Full training provided.",
    posted: "5 days ago"
  },
  {
    id: "5",
    title: "Handicraft Artisan",
    company: "Craft India NGO",
    location: "Jaipur, Rajasthan",
    type: "On-site",
    salary: "Rs. 1.5 - 2.5 LPA",
    accessibility: ["Accessible workspace", "Flexible hours", "Skill development support"],
    skills: ["Handicraft", "Creativity", "Patience"],
    description: "Create traditional handicrafts. Work at your own pace in an accessible workshop environment.",
    posted: "1 week ago"
  },
  {
    id: "6",
    title: "Voice Over Artist",
    company: "Audio Productions",
    location: "Hyderabad, Telangana",
    type: "Remote",
    salary: "Rs. 3 - 6 LPA",
    accessibility: ["Remote work", "Flexible schedule", "Home studio setup supported"],
    skills: ["Clear voice", "Hindi", "English", "Telugu"],
    description: "Record voice overs for videos, audiobooks, and advertisements. Equipment and training provided.",
    posted: "4 days ago"
  }
]

const skillOptions = [
  "Communication", "Computer basics", "MS Office", "Writing", "Typing",
  "Hindi", "English", "Tamil", "Telugu", "Data Entry", "Customer Service",
  "Research", "Handicraft", "Teaching", "Accounting"
]

export function JobMatcher() {
  const [step, setStep] = useState<"form" | "results">("form")
  const [showFilters, setShowFilters] = useState(false)
  const [formData, setFormData] = useState({
    skills: [] as string[],
    education: "",
    workPreference: "",
    disabilityType: "",
  })
  const [filters, setFilters] = useState({
    type: "all",
    search: "",
  })
  const t = useTranslation()

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const filteredJobs = sampleJobs.filter(job => {
    if (filters.type !== "all" && job.type !== filters.type) return false
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !job.company.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const getMatchScore = (job: Job): number => {
    if (formData.skills.length === 0) return 85
    const matchedSkills = job.skills.filter(skill => 
      formData.skills.some(s => skill.toLowerCase().includes(s.toLowerCase()))
    )
    return Math.min(95, 60 + (matchedSkills.length / job.skills.length) * 35)
  }

  if (step === "form") {
    return (
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">{t("jobs")}</h1>
            <p className="text-lg text-muted-foreground">
              Find accessible job opportunities matched to your skills and preferences.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Help us find the best jobs for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  What are your skills? (Select all that apply)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        formData.skills.includes(skill)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <Label htmlFor="education" className="text-base font-medium">
                  What is your education level?
                </Label>
                <Select
                  value={formData.education}
                  onValueChange={(value) => setFormData({ ...formData, education: value })}
                >
                  <SelectTrigger id="education" className="h-12 text-lg">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below10">Below 10th</SelectItem>
                    <SelectItem value="10th">10th Pass</SelectItem>
                    <SelectItem value="12th">12th Pass</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                    <SelectItem value="postgraduate">Post Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Work Preference */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Work Preference
                </Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { value: "remote", label: "Work from Home", icon: Home },
                    { value: "onsite", label: "Office/On-site", icon: Building2 },
                    { value: "any", label: "Any", icon: Briefcase },
                  ].map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, workPreference: option.value })}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                          formData.workPreference === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${
                          formData.workPreference === option.value ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.workPreference === option.value ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Disability Type */}
              <div className="space-y-2">
                <Label htmlFor="disability" className="text-base font-medium">
                  Type of disability (optional - helps us find accessible jobs)
                </Label>
                <Select
                  value={formData.disabilityType}
                  onValueChange={(value) => setFormData({ ...formData, disabilityType: value })}
                >
                  <SelectTrigger id="disability" className="h-12 text-lg">
                    <SelectValue placeholder="Select if applicable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visual">Visual Impairment</SelectItem>
                    <SelectItem value="hearing">Hearing Impairment</SelectItem>
                    <SelectItem value="locomotor">Locomotor Disability</SelectItem>
                    <SelectItem value="intellectual">Intellectual Disability</SelectItem>
                    <SelectItem value="multiple">Multiple Disabilities</SelectItem>
                    <SelectItem value="none">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setStep("results")}
                className="h-14 w-full text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Find Jobs for Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Jobs For You</h1>
            <p className="text-muted-foreground">
              Found {filteredJobs.length} accessible jobs matching your profile
            </p>
          </div>
          <Button variant="outline" onClick={() => setStep("form")}>
            Edit Profile
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="h-12 pl-10 text-lg"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <span className="mr-2 text-sm font-medium text-muted-foreground">Work Type:</span>
                {["all", "Remote", "On-site", "Hybrid"].map((type) => (
                  <Button
                    key={type}
                    variant={filters.type === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilters({ ...filters, type })}
                  >
                    {type === "all" ? "All" : type}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredJobs.map((job) => {
            const matchScore = getMatchScore(job)
            return (
              <Card key={job.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-1 text-xl">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`shrink-0 ${
                        matchScore >= 80 ? "bg-primary/10 text-primary" : "bg-muted"
                      }`}
                    >
                      {Math.round(matchScore)}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      {job.type === "Remote" ? <Home className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </span>
                  </div>

                  <p className="text-muted-foreground">{job.description}</p>

                  {/* Salary */}
                  <p className="text-lg font-semibold text-primary">{job.salary}</p>

                  {/* Accessibility Features */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Accessibility Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.accessibility.map((feature, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            formData.skills.includes(skill)
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No jobs found matching your criteria. Try adjusting your filters.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
