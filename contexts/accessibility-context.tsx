"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "hi" | "ta"

interface AccessibilityContextType {
  language: Language
  setLanguage: (lang: Language) => void
  highContrast: boolean
  setHighContrast: (value: boolean) => void
  fontSize: "normal" | "large" | "xlarge"
  setFontSize: (size: "normal" | "large" | "xlarge") => void
  voiceEnabled: boolean
  setVoiceEnabled: (value: boolean) => void
  speak: (text: string) => void
  stopSpeaking: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    schemes: "AI Scheme Assistant",
    jobs: "Job Matching",
    signLanguage: "Sign Language",
    paraSports: "Para Sports",
    help: "Help & Support",
    welcome: "Welcome to Your AI",
    tagline: "Empowering Every Citizen with AI-Powered Assistance",
    mission: "We help elderly people and persons with disabilities discover government schemes, find suitable jobs, and access opportunities with dignity.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    featuresTitle: "How We Help You",
    schemeTitle: "Government Schemes",
    schemeDesc: "Find and apply for schemes based on your needs",
    jobTitle: "Job Matching",
    jobDesc: "Discover accessible job opportunities",
    signTitle: "Sign Language Support",
    signDesc: "Real-time translation of sign language",
    sportsTitle: "Para Sports Aid",
    sportsDesc: "Information about para-sports and training",
    accessibility: "Accessibility",
    highContrastMode: "High Contrast",
    voiceSupport: "Voice Support",
    textSize: "Text Size",
    selectLanguage: "Select Language",
  },
  hi: {
    home: "होम",
    schemes: "AI योजना सहायक",
    jobs: "नौकरी मिलान",
    signLanguage: "सांकेतिक भाषा",
    paraSports: "पैरा खेल",
    help: "सहायता",
    welcome: "Your AI में आपका स्वागत है",
    tagline: "AI-संचालित सहायता के साथ हर नागरिक को सशक्त बनाना",
    mission: "हम बुजुर्गों और विकलांग व्यक्तियों को सरकारी योजनाएं खोजने, उपयुक्त नौकरियां पाने और सम्मान के साथ अवसरों तक पहुंचने में मदद करते हैं।",
    getStarted: "शुरू करें",
    learnMore: "और जानें",
    featuresTitle: "हम आपकी कैसे मदद करते हैं",
    schemeTitle: "सरकारी योजनाएं",
    schemeDesc: "अपनी जरूरतों के आधार पर योजनाएं खोजें और आवेदन करें",
    jobTitle: "नौकरी मिलान",
    jobDesc: "सुलभ नौकरी के अवसर खोजें",
    signTitle: "सांकेतिक भाषा सहायता",
    signDesc: "सांकेतिक भाषा का वास्तविक समय अनुवाद",
    sportsTitle: "पैरा खेल सहायता",
    sportsDesc: "पैरा-खेल और प्रशिक्षण के बारे में जानकारी",
    accessibility: "सुगम्यता",
    highContrastMode: "उच्च कंट्रास्ट",
    voiceSupport: "आवाज सहायता",
    textSize: "टेक्स्ट साइज",
    selectLanguage: "भाषा चुनें",
  },
  ta: {
    home: "முகப்பு",
    schemes: "AI திட்ட உதவியாளர்",
    jobs: "வேலை பொருத்தம்",
    signLanguage: "சைகை மொழி",
    paraSports: "பாரா விளையாட்டு",
    help: "உதவி",
    welcome: "Your AI க்கு வரவேற்கிறோம்",
    tagline: "AI ஆற்றல் உதவியுடன் ஒவ்வொரு குடிமகனையும் மேம்படுத்துதல்",
    mission: "முதியோர் மற்றும் மாற்றுத்திறனாளிகள் அரசு திட்டங்களைக் கண்டறியவும், பொருத்தமான வேலைகளைக் கண்டறியவும், கண்ணியத்துடன் வாய்ப்புகளை அணுகவும் நாங்கள் உதவுகிறோம்.",
    getStarted: "தொடங்கு",
    learnMore: "மேலும் அறிக",
    featuresTitle: "நாங்கள் உங்களுக்கு எப்படி உதவுகிறோம்",
    schemeTitle: "அரசு திட்டங்கள்",
    schemeDesc: "உங்கள் தேவைகளின் அடிப்படையில் திட்டங்களைக் கண்டறிந்து விண்ணப்பிக்கவும்",
    jobTitle: "வேலை பொருத்தம்",
    jobDesc: "அணுகக்கூடிய வேலை வாய்ப்புகளைக் கண்டறியுங்கள்",
    signTitle: "சைகை மொழி ஆதரவு",
    signDesc: "சைகை மொழியின் நிகழ்நேர மொழிபெயர்ப்பு",
    sportsTitle: "பாரா விளையாட்டு உதவி",
    sportsDesc: "பாரா விளையாட்டு மற்றும் பயிற்சி பற்றிய தகவல்",
    accessibility: "அணுகல்தன்மை",
    highContrastMode: "அதிக மாறுபாடு",
    voiceSupport: "குரல் ஆதரவு",
    textSize: "எழுத்து அளவு",
    selectLanguage: "மொழியைத் தேர்ந்தெடு",
  },
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal")
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  useEffect(() => {
    document.documentElement.classList.remove("text-base", "text-lg", "text-xl")
    const sizeClass = fontSize === "large" ? "text-lg" : fontSize === "xlarge" ? "text-xl" : "text-base"
    document.documentElement.classList.add(sizeClass)
  }, [fontSize])

  const speak = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined") return
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-IN"
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel()
    }
  }

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        setLanguage,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        voiceEnabled,
        setVoiceEnabled,
        speak,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider")
  }
  return context
}

export function useTranslation() {
  const { language } = useAccessibility()
  return (key: string) => translations[language][key] || key
}

export { translations }
