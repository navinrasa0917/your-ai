"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { 
  Camera, 
  CameraOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Hand, 
  RefreshCw, 
  Play, 
  Square, 
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAccessibility, useTranslation } from "@/contexts/accessibility-context"
import { useHandDetector } from "@/hooks/use-hand-detector"
import { gestureTranslations, type RecognizedGesture, type FingerStates } from "@/lib/gesture-recognition"

const commonPhrases = [
  { key: "hello", label: "Hello / Greeting" },
  { key: "thank_you", label: "Thank You" },
  { key: "please", label: "Please" },
  { key: "help", label: "Need Help" },
  { key: "yes", label: "Yes" },
  { key: "no", label: "No" },
  { key: "water", label: "Water" },
  { key: "food", label: "Food" },
  { key: "good", label: "Good" },
  { key: "one", label: "One" },
]

// Finger indicator component
function FingerIndicator({ states }: { states: FingerStates | null }) {
  if (!states) return null
  
  const fingers = [
    { name: "Thumb", active: states.thumb },
    { name: "Index", active: states.index },
    { name: "Middle", active: states.middle },
    { name: "Ring", active: states.ring },
    { name: "Pinky", active: states.pinky },
  ]

  return (
    <div className="flex items-center justify-center gap-1">
      {fingers.map((finger) => (
        <div key={finger.name} className="flex flex-col items-center">
          <div 
            className={`h-6 w-3 rounded-full transition-colors ${
              finger.active ? "bg-primary" : "bg-muted-foreground/30"
            }`}
            title={finger.name}
          />
          <span className="mt-1 text-xs text-muted-foreground">{finger.name[0]}</span>
        </div>
      ))}
    </div>
  )
}

export function SignLanguageTranslator() {
  const [cameraActive, setCameraActive] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState<"en" | "hi" | "ta">("en")
  const [translatedText, setTranslatedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [recentGestures, setRecentGestures] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { voiceEnabled } = useAccessibility()
  const t = useTranslation()

  // Handle gesture detection
  const handleGestureDetected = useCallback((gesture: RecognizedGesture, translation: { en: string; hi: string; ta: string }) => {
    if (!gesture) return
    
    const translatedWord = translation[outputLanguage]
    setTranslatedText(prev => {
      // Avoid repeating the same word twice in a row
      const words = prev.split(" ").filter(Boolean)
      if (words[words.length - 1] === translatedWord) return prev
      return prev ? `${prev} ${translatedWord}` : translatedWord
    })
    
    // Track recent gestures for display
    setRecentGestures(prev => {
      const updated = [gesture, ...prev.slice(0, 4)]
      return updated
    })
  }, [outputLanguage])

  const {
    isModelLoaded,
    isDetecting,
    currentGesture,
    error: detectorError,
    startDetection,
    stopDetection,
    loadModel,
  } = useHandDetector({
    onGestureDetected: handleGestureDetected,
    minConfidence: 0.65,
    detectionInterval: 150,
  })

  // Load model on component mount
  useEffect(() => {
    const initModel = async () => {
      setIsLoadingModel(true)
      await loadModel()
      setIsLoadingModel(false)
    }
    initModel()
  }, [loadModel])

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
    stopDetection()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  const toggleTranslation = () => {
    if (isDetecting) {
      stopDetection()
    } else {
      if (!isModelLoaded) {
        alert("AI model is still loading. Please wait a moment.")
        return
      }
      if (videoRef.current) {
        startDetection(videoRef.current)
        setTranslatedText("")
        setRecentGestures([])
      }
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
    setRecentGestures([])
  }

  const addQuickPhrase = (key: string) => {
    const translation = gestureTranslations[key]
    if (translation) {
      setTranslatedText(prev => prev ? `${prev} ${translation[outputLanguage]}` : translation[outputLanguage])
    }
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
          
          {/* Model Status */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {isLoadingModel ? (
              <Badge variant="secondary" className="gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading AI Model...
              </Badge>
            ) : isModelLoaded ? (
              <Badge variant="default" className="gap-2 bg-primary">
                <Sparkles className="h-3 w-3" />
                AI Model Ready
              </Badge>
            ) : detectorError ? (
              <Badge variant="destructive" className="gap-2">
                <AlertCircle className="h-3 w-3" />
                {detectorError}
              </Badge>
            ) : null}
          </div>
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
                Position your hand clearly in front of the camera to detect gestures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Container */}
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${cameraActive ? "block" : "hidden"}`}
                />
                <canvas 
                  ref={canvasRef} 
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
                
                {/* Detection overlay */}
                {cameraActive && isDetecting && (
                  <div className="absolute inset-x-0 top-0 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-1.5 text-primary-foreground">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" />
                        <span className="text-sm font-medium">Detecting...</span>
                      </div>
                      {currentGesture?.gesture && (
                        <Badge variant="secondary" className="text-sm">
                          {gestureTranslations[currentGesture.gesture]?.en || currentGesture.gesture}
                          {currentGesture.confidence > 0 && (
                            <span className="ml-1 opacity-70">
                              ({Math.round(currentGesture.confidence * 100)}%)
                            </span>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Gesture confidence bar */}
                {cameraActive && isDetecting && currentGesture && (
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="rounded-lg bg-background/90 p-3 backdrop-blur-sm">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {currentGesture.gesture 
                            ? gestureTranslations[currentGesture.gesture]?.en || "Analyzing..."
                            : "Show your hand"
                          }
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(currentGesture.confidence * 100)}% confident
                        </span>
                      </div>
                      <Progress value={currentGesture.confidence * 100} className="h-2" />
                      <div className="mt-3">
                        <FingerIndicator states={currentGesture.fingerStates} />
                      </div>
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
                      variant={isDetecting ? "destructive" : "default"}
                      disabled={!isModelLoaded}
                    >
                      {isDetecting ? (
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
                      Turn Off
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={startCamera} 
                    className="w-full gap-2" 
                    size="lg"
                    disabled={isLoadingModel}
                  >
                    {isLoadingModel ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading AI Model...
                      </>
                    ) : (
                      <>
                        <Camera className="h-5 w-5" />
                        Turn On Camera
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Recent Gestures */}
              {recentGestures.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Recent gestures:</p>
                  <div className="flex flex-wrap gap-2">
                    {recentGestures.map((gesture, idx) => (
                      <Badge key={`${gesture}-${idx}`} variant="outline">
                        {gestureTranslations[gesture]?.en || gesture}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
                      className="bg-transparent text-sm"
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
                    {isDetecting 
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

              {/* Supported Gestures */}
              <div className="rounded-lg bg-primary/5 p-4">
                <p className="mb-3 font-medium text-foreground">Supported Gestures:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✋</span>
                    <span>Open palm = Hello</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👍</span>
                    <span>Thumbs up = Yes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👎</span>
                    <span>Thumbs down = No</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✌️</span>
                    <span>Peace = Two</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👌</span>
                    <span>OK sign = Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✊</span>
                    <span>Fist = Help</span>
                  </div>
                </div>
              </div>

              {/* Language Info */}
              <div className="rounded-lg bg-secondary/50 p-4">
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
            <div className="grid gap-6 sm:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Wait for AI",
                  description: "The AI model loads automatically. Wait for the 'AI Model Ready' badge.",
                },
                {
                  step: "2",
                  title: "Turn on Camera",
                  description: "Allow camera access and position your hand clearly visible in frame.",
                },
                {
                  step: "3",
                  title: "Make Gestures",
                  description: "Start translation and hold gestures steadily for 1-2 seconds.",
                },
                {
                  step: "4",
                  title: "Get Output",
                  description: "See real-time translation and use voice output in your language.",
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
