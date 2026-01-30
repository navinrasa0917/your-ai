"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, CameraOff, Volume2, VolumeX, Copy, Check, Hand, RefreshCw, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility, useTranslation } from "@/contexts/accessibility-context"

const signDictionary: Record<string, { en: string; hi: string; ta: string }> = {
  "hello": { en: "Hello", hi: "नमस्ते", ta: "வணக்கம்" },
  "thank_you": { en: "Thank You", hi: "धन्यवाद", ta: "நன்றி" },
  "please": { en: "Please", hi: "कृपया", ta: "தயவுசெய்து" },
  "help": { en: "I need help", hi: "मुझे मदद चाहिए", ta: "எனக்கு உதவி வேண்டும்" },
  "yes": { en: "Yes", hi: "हां", ta: "ஆம்" },
  "no": { en: "No", hi: "नहीं", ta: "இல்லை" },
  "water": { en: "Water", hi: "पानी", ta: "தண்ணீர்" },
  "food": { en: "Food", hi: "खाना", ta: "உணவு" },
  "medicine": { en: "Medicine", hi: "दवाई", ta: "மருந்து" },
  "hospital": { en: "Hospital", hi: "अस्पताल", ta: "மருத்துவமனை" },
  "family": { en: "Family", hi: "परिवार", ta: "குடும்பம்" },
  "money": { en: "Money", hi: "पैसा", ta: "பணம்" },
  "home": { en: "Home", hi: "घर", ta: "வீடு" },
  "work": { en: "Work", hi: "काम", ta: "வேலை" },
  "good": { en: "Good", hi: "अच्छा", ta: "நல்லது" },
}

const commonPhrases = [
  { key: "hello", label: "Hello / Greeting" },
  { key: "thank_you", label: "Thank You" },
  { key: "please", label: "Please" },
  { key: "help", label: "Need Help" },
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
  { key: "water", label: "Water" },
  { key: "food", label: "Food" },
  { key: "medicine", label: "Medicine" },
  { key: "hospital", label: "Hospital" },
]

export function SignLanguageTranslator() {
  const [cameraActive, setCameraActive] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState<"en" | "hi" | "ta">("en")
  const [translatedText, setTranslatedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { speak, voiceEnabled } = useAccessibility()
  const t = useTranslation()

  // Simulated translation - in real app this would use ML model
  const simulateTranslation = () => {
    if (!isTranslating) return
    
    const keys = Object.keys(signDictionary)
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    const translation = signDictionary[randomKey][outputLanguage]
    setTranslatedText(prev => prev ? `${prev} ${translation}` : translation)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTranslating && cameraActive) {
      interval = setInterval(simulateTranslation, 3000)
    }
    return () => clearInterval(interval)
  }, [isTranslating, cameraActive, outputLanguage])

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Edge.")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user", 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        },
        audio: false
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for the video to be ready to play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setCameraActive(true)
          }).catch((playError) => {
            console.error("Error playing video:", playError)
          })
        }
      }
    } catch (error: unknown) {
      const err = error as Error
      if (err.name === "NotAllowedError") {
        alert("Camera permission was denied. Please allow camera access in your browser settings and try again.")
      } else if (err.name === "NotFoundError") {
        alert("No camera found. Please connect a camera and try again.")
      } else if (err.name === "NotReadableError") {
        alert("Camera is in use by another application. Please close other apps using the camera and try again.")
      } else {
        alert("Unable to access camera. Please check your camera permissions and try again.")
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setIsTranslating(false)
  }

  const toggleTranslation = () => {
    setIsTranslating(!isTranslating)
    if (!isTranslating) {
      setTranslatedText("")
    }
  }

  const speakTranslation = () => {
    if (!translatedText) return
    
    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(translatedText)
    utterance.lang = outputLanguage === "hi" ? "hi-IN" : outputLanguage === "ta" ? "ta-IN" : "en-IN"
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearTranslation = () => {
    setTranslatedText("")
  }

  const addQuickPhrase = (key: string) => {
    const translation = signDictionary[key][outputLanguage]
    setTranslatedText(prev => prev ? `${prev} ${translation}` : translation)
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Hand className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("signLanguage")}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Use your camera to translate sign language gestures into text and voice. 
            Supports English, Hindi, and Tamil output.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Camera Section */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Input
              </CardTitle>
              <CardDescription>
                Position yourself in front of the camera and make sign gestures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Container */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                {/* Video element always rendered, visibility controlled by CSS */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${cameraActive ? "block" : "hidden"}`}
                />
                {cameraActive && isTranslating && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 rounded-lg bg-primary/90 px-4 py-2 text-primary-foreground">
                      <div className="h-3 w-3 animate-pulse rounded-full bg-primary-foreground" />
                      <span className="text-sm font-medium">Analyzing gestures...</span>
                    </div>
                  </div>
                )}
                {!cameraActive && (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <CameraOff className="mb-4 h-16 w-16 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-muted-foreground">Camera is off</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click the button below to start your camera
                    </p>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex flex-wrap gap-3">
                {cameraActive ? (
                  <>
                    <Button
                      onClick={toggleTranslation}
                      className="flex-1 gap-2"
                      variant={isTranslating ? "destructive" : "default"}
                    >
                      {isTranslating ? (
                        <>
                          <Square className="h-4 w-4" />
                          Stop Translation
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Start Translation
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="gap-2 bg-transparent"
                    >
                      <CameraOff className="h-4 w-4" />
                      Turn Off Camera
                    </Button>
                  </>
                ) : (
                  <Button onClick={startCamera} className="w-full gap-2" size="lg">
                    <Camera className="h-5 w-5" />
                    Turn On Camera
                  </Button>
                )}
              </div>

              {/* Quick Phrases */}
              <div className="border-t border-border pt-4">
                <p className="mb-3 text-sm font-medium text-muted-foreground">
                  Quick phrases (click to add):
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonPhrases.map((phrase) => (
                    <Button
                      key={phrase.key}
                      variant="outline"
                      size="sm"
                      onClick={() => addQuickPhrase(phrase.key)}
                      className="text-sm"
                    >
                      {phrase.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Translation Output
                  </CardTitle>
                  <CardDescription>
                    Translated text appears here in your chosen language.
                  </CardDescription>
                </div>
                <Select
                  value={outputLanguage}
                  onValueChange={(value: "en" | "hi" | "ta") => setOutputLanguage(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Translation Output Box */}
              <div className="min-h-[200px] rounded-xl border border-border bg-muted/50 p-6">
                {translatedText ? (
                  <p className="text-2xl leading-relaxed text-foreground">{translatedText}</p>
                ) : (
                  <p className="text-lg text-muted-foreground">
                    {isTranslating 
                      ? "Waiting for sign language gestures..."
                      : "Start translation to see output here."}
                  </p>
                )}
              </div>

              {/* Output Controls */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={isSpeaking ? stopSpeaking : speakTranslation}
                  variant={isSpeaking ? "destructive" : "default"}
                  disabled={!translatedText}
                  className="flex-1 gap-2"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      Stop Speaking
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      Speak Translation
                    </>
                  )}
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  disabled={!translatedText}
                  className="gap-2 bg-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={clearTranslation}
                  variant="outline"
                  disabled={!translatedText}
                  className="gap-2 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </Button>
              </div>

              {/* Language Info */}
              <div className="rounded-lg bg-primary/5 p-4">
                <p className="mb-2 font-medium text-foreground">Output Language:</p>
                <p className="text-muted-foreground">
                  {outputLanguage === "en" && "English - Universal language support"}
                  {outputLanguage === "hi" && "हिंदी - भारत की राष्ट्रीय भाषा"}
                  {outputLanguage === "ta" && "தமிழ் - தென்னிந்தியாவின் முக்கிய மொழி"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use Sign Language Translator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Turn on Camera",
                  description: "Allow camera access and position yourself so your hands are clearly visible.",
                },
                {
                  step: "2",
                  title: "Make Gestures",
                  description: "Start translation and make Indian Sign Language (ISL) gestures slowly and clearly.",
                },
                {
                  step: "3",
                  title: "Get Output",
                  description: "See the translation in text and use voice output to speak it in your preferred language.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
