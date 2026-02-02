"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, CameraOff, Volume2, VolumeX, Copy, Check, Hand, RefreshCw, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccessibility, useTranslation } from "@/contexts/accessibility-context"
import * as handpose from '@tensorflow-models/handpose'
import * as tf from '@tensorflow/tfjs'

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
  const [detectionStatus, setDetectionStatus] = useState("Ready to detect signs")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const modelRef = useRef<handpose.HandPose | null>(null)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { speak, voiceEnabled } = useAccessibility()
  const t = useTranslation()

  // Load Handpose model
  useEffect(() => {
    const loadHandposeModel = async () => {
      try {
        // Wait for TensorFlow.js to be ready
        await tf.ready()
        console.log("TensorFlow.js backend:", tf.getBackend())
        
        // Load the handpose model
        const model = await handpose.load()
        modelRef.current = model
        console.log("✅ Handpose model loaded successfully!")
        setDetectionStatus("AI model loaded. Start camera to detect signs.")
      } catch (error) {
        console.error("❌ Error loading handpose model:", error)
        setDetectionStatus("Error loading AI model. Please refresh.")
      }
    }

    loadHandposeModel()

    // Cleanup
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Start hand detection when translation is active
  useEffect(() => {
    if (isTranslating && cameraActive && modelRef.current) {
      startHandDetection()
    } else {
      stopHandDetection()
    }

    return () => {
      stopHandDetection()
    }
  }, [isTranslating, cameraActive])

  const startHandDetection = () => {
    if (!modelRef.current || !videoRef.current) {
      console.warn("Model or video not ready")
      return
    }

    setDetectionStatus("🔍 Detecting hand signs...")

    // Clear any existing interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    // Run detection every 500ms
    detectionIntervalRef.current = setInterval(async () => {
      try {
        if (!modelRef.current || !videoRef.current || videoRef.current.readyState !== 4) {
          return
        }

        // Detect hands
        const predictions = await modelRef.current.estimateHands(videoRef.current)
        
        if (predictions.length > 0) {
          // Hand detected - analyze landmarks
          const hand = predictions[0]
          const landmarks = hand.landmarks
          
          // Detect the sign based on hand landmarks
          const detectedSign = detectSignFromLandmarks(landmarks)
          
          if (detectedSign && signDictionary[detectedSign]) {
            // Get translation for the detected sign
            const translation = signDictionary[detectedSign][outputLanguage]
            setTranslatedText(prev => {
              // Don't repeat the same sign immediately
              if (prev.includes(translation)) return prev
              return translation
            })
            setDetectionStatus(`✅ Detected: ${detectedSign}`)
          } else {
            setDetectionStatus("✋ Hand detected - make a clearer sign")
          }
        } else {
          setDetectionStatus("Show your hand to the camera...")
        }
      } catch (error) {
        console.error("Detection error:", error)
        setDetectionStatus("Detection error - try again")
      }
    }, 500)
  }

  const stopHandDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    setDetectionStatus("Detection stopped")
  }

  // Hand sign detection logic
  const detectSignFromLandmarks = (landmarks: number[][]): string | null => {
    if (!landmarks || landmarks.length < 21) return null
    
    // Landmark indices for hand joints
    const WRIST = 0
    const THUMB_CMC = 1
    const THUMB_MCP = 2
    const THUMB_IP = 3
    const THUMB_TIP = 4
    const INDEX_FINGER_MCP = 5
    const INDEX_FINGER_PIP = 6
    const INDEX_FINGER_DIP = 7
    const INDEX_FINGER_TIP = 8
    const MIDDLE_FINGER_MCP = 9
    const MIDDLE_FINGER_PIP = 10
    const MIDDLE_FINGER_DIP = 11
    const MIDDLE_FINGER_TIP = 12
    const RING_FINGER_MCP = 13
    const RING_FINGER_PIP = 14
    const RING_FINGER_DIP = 15
    const RING_FINGER_TIP = 16
    const PINKY_MCP = 17
    const PINKY_PIP = 18
    const PINKY_DIP = 19
    const PINKY_TIP = 20

    // Helper function to calculate distance between two points
    const distance = (p1: number[], p2: number[]) => {
      return Math.sqrt(
        Math.pow(p1[0] - p2[0], 2) + 
        Math.pow(p1[1] - p2[1], 2)
      )
    }

    // Helper function to check if finger is extended
    const isFingerExtended = (tip: number[], mcp: number[], wrist: number[]) => {
      const tipToWrist = distance(tip, wrist)
      const mcpToWrist = distance(mcp, wrist)
      return tip[1] < mcp[1] - 20 && tipToWrist > mcpToWrist + 30
    }

    // Get positions
    const wrist = landmarks[WRIST]
    const thumbTip = landmarks[THUMB_TIP]
    const indexTip = landmarks[INDEX_FINGER_TIP]
    const middleTip = landmarks[MIDDLE_FINGER_TIP]
    const ringTip = landmarks[RING_FINGER_TIP]
    const pinkyTip = landmarks[PINKY_TIP]
    
    const indexMCP = landmarks[INDEX_FINGER_MCP]
    const middleMCP = landmarks[MIDDLE_FINGER_MCP]
    const ringMCP = landmarks[RING_FINGER_MCP]
    const pinkyMCP = landmarks[PINKY_MCP]

    // Check finger states
    const thumbExtended = thumbTip[1] < wrist[1] - 30
    const indexExtended = isFingerExtended(indexTip, indexMCP, wrist)
    const middleExtended = isFingerExtended(middleTip, middleMCP, wrist)
    const ringExtended = isFingerExtended(ringTip, ringMCP, wrist)
    const pinkyExtended = isFingerExtended(pinkyTip, pinkyMCP, wrist)

    // Calculate distances between fingertips
    const thumbIndexDist = distance(thumbTip, indexTip)
    const indexMiddleDist = distance(indexTip, middleTip)

    // Sign detection logic
    // Thumbs up 👍
    if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return "yes"
    }
    
    // Thumbs down 👎
    if (!thumbExtended && thumbTip[1] > wrist[1] + 50 && !indexExtended && !middleExtended) {
      return "no"
    }
    
    // Open hand (Hello) ✋
    if (indexExtended && middleExtended && ringExtended && pinkyExtended && 
        thumbTip[0] > wrist[0] + 20) {
      return "hello"
    }
    
    // Index finger up (Help) ☝️
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && 
        thumbIndexDist > 50) {
      return "help"
    }
    
    // Peace sign ✌️
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && 
        thumbIndexDist > 40) {
      return "thank_you"
    }
    
    // OK sign 👌
    if (!indexExtended && !middleExtended && thumbIndexDist < 30 && 
        indexMiddleDist < 30) {
      return "please"
    }
    
    // Pinch gesture (Water)
    if (thumbIndexDist < 25 && !middleExtended && !ringExtended && !pinkyExtended) {
      return "ok"
    }
    
    // All fingers closed (Food)
    if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return "food"
    }
    
    // Index and middle fingers crossed (Medicine)
    if (indexExtended && middleExtended && indexMiddleDist < 20) {
      return "medicine"
    }
    
    // Crossed fingers 🤞
    if (middleExtended && ringExtended && 
        distance(middleTip, ringTip) < 20) {
      return "hospital"
    }

    return null
  }

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
            setDetectionStatus("Camera ready. Start translation to detect signs.")
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
    stopHandDetection()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setIsTranslating(false)
    setDetectionStatus("Camera stopped")
  }

  const toggleTranslation = () => {
    if (!cameraActive) {
      alert("Please start the camera first!")
      return
    }
    
    if (!modelRef.current) {
      alert("AI model is still loading. Please wait a moment...")
      return
    }
    
    setIsTranslating(!isTranslating)
    if (!isTranslating) {
      setTranslatedText("")
      setDetectionStatus("Starting sign detection...")
    }
  }

  const speakTranslation = () => {
    if (!translatedText) return
    
    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(translatedText)
    utterance.lang = outputLanguage === "hi" ? "hi-IN" : outputLanguage === "ta" ? "ta-IN" : "en-IN"
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
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
          {/* Detection Status */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <div className={`h-2 w-2 rounded-full ${isTranslating ? 'animate-pulse bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">{detectionStatus}</span>
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
                {/* Hidden canvas for processing */}
                <canvas 
                  ref={canvasRef} 
                  className="hidden" 
                  width="640" 
                  height="480"
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
                      disabled={!modelRef.current}
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

              {/* Sign Detection Tips */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="mb-2 font-medium text-foreground">💡 Sign Detection Tips:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Make signs slowly and clearly</li>
                  <li>• Keep hand within camera frame</li>
                  <li>• Ensure good lighting on your hands</li>
                  <li>• Try thumbs up for "Yes"</li>
                  <li>• Try open hand for "Hello"</li>
                </ul>
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
                      ? "Make hand gestures in front of the camera..."
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

              {/* Detected Signs */}
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="mb-2 font-medium text-foreground">🎯 Try These Signs:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">👍 Thumbs up:</span>
                    <span>Yes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">✋ Open hand:</span>
                    <span>Hello</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">👎 Thumbs down:</span>
                    <span>No</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">☝️ Index up:</span>
                    <span>Help</span>
                  </div>
                </div>
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
                  description: "Start translation and make sign gestures slowly and clearly.",
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