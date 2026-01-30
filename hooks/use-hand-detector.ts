"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { 
  parseHandLandmarks, 
  recognizeGesture, 
  gestureTranslations,
  type GestureResult,
  type RecognizedGesture 
} from "@/lib/gesture-recognition"

// TensorFlow.js types
interface Hand {
  keypoints: Array<{ x: number; y: number; z?: number; name?: string }>
  keypoints3D?: Array<{ x: number; y: number; z: number }>
  handedness: string
  score: number
}

interface HandDetector {
  estimateHands: (video: HTMLVideoElement) => Promise<Hand[]>
}

interface HandPoseDetection {
  SupportedModels: { MediaPipeHands: string }
  createDetector: (model: string, config: object) => Promise<HandDetector>
}

declare global {
  interface Window {
    handPoseDetection?: HandPoseDetection
  }
}

export interface UseHandDetectorOptions {
  onGestureDetected?: (gesture: RecognizedGesture, translation: { en: string; hi: string; ta: string }) => void
  minConfidence?: number
  detectionInterval?: number
}

export interface UseHandDetectorReturn {
  isModelLoaded: boolean
  isDetecting: boolean
  currentGesture: GestureResult | null
  error: string | null
  startDetection: (video: HTMLVideoElement) => void
  stopDetection: () => void
  loadModel: () => Promise<void>
}

export function useHandDetector(options: UseHandDetectorOptions = {}): UseHandDetectorReturn {
  const { 
    onGestureDetected, 
    minConfidence = 0.7,
    detectionInterval = 200 // ms between detections
  } = options

  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [currentGesture, setCurrentGesture] = useState<GestureResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const detectorRef = useRef<HandDetector | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastDetectionRef = useRef<number>(0)
  const lastGestureRef = useRef<RecognizedGesture | null>(null)
  const gestureCountRef = useRef<number>(0)

  // Load scripts dynamically
  const loadScripts = useCallback(async () => {
    // Check if already loaded
    if (window.handPoseDetection) return true

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load ${src}`))
        document.head.appendChild(script)
      })
    }

    try {
      // Load TensorFlow.js core first
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.17.0/dist/tf-core.min.js")
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4.17.0/dist/tf-converter.min.js")
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.17.0/dist/tf-backend-webgl.min.js")
      // Load hand pose detection
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.1/dist/hand-pose-detection.min.js")
      
      // Wait a bit for initialization
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return true
    } catch (err) {
      console.error("Failed to load TensorFlow scripts:", err)
      return false
    }
  }, [])

  // Load the hand detection model
  const loadModel = useCallback(async () => {
    try {
      setError(null)
      
      // Load scripts first
      const scriptsLoaded = await loadScripts()
      if (!scriptsLoaded) {
        throw new Error("Failed to load required scripts")
      }

      const handPoseDetection = window.handPoseDetection
      if (!handPoseDetection) {
        throw new Error("Hand pose detection library not available")
      }

      // Create detector using MediaPipe Hands with TFJS runtime
      const model = handPoseDetection.SupportedModels.MediaPipeHands
      const detector = await handPoseDetection.createDetector(model, {
        runtime: "tfjs",
        modelType: "lite", // Use lite model for faster performance
        maxHands: 1,
      })

      detectorRef.current = detector
      setIsModelLoaded(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load model"
      setError(errorMessage)
      console.error("Model loading error:", err)
    }
  }, [loadScripts])

  // Detection loop
  const detectHands = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current || !isDetecting) return

    const now = Date.now()
    if (now - lastDetectionRef.current < detectionInterval) {
      animationFrameRef.current = requestAnimationFrame(detectHands)
      return
    }
    lastDetectionRef.current = now

    try {
      const hands = await detectorRef.current.estimateHands(videoRef.current)
      
      if (hands.length > 0) {
        const hand = hands[0]
        // Convert keypoints to 2D array format
        const landmarks = hand.keypoints.map(kp => [kp.x, kp.y, kp.z || 0])
        const parsed = parseHandLandmarks(landmarks)
        const result = recognizeGesture(parsed)
        
        setCurrentGesture(result)

        // Only trigger callback if gesture is confident and stable
        if (result.gesture && result.confidence >= minConfidence) {
          // Require same gesture to be detected multiple times for stability
          if (result.gesture === lastGestureRef.current) {
            gestureCountRef.current++
            // Trigger after 3 consecutive detections of same gesture
            if (gestureCountRef.current === 3 && onGestureDetected) {
              const translation = gestureTranslations[result.gesture]
              if (translation) {
                onGestureDetected(result.gesture, translation)
              }
            }
          } else {
            lastGestureRef.current = result.gesture
            gestureCountRef.current = 1
          }
        }
      } else {
        setCurrentGesture(null)
        lastGestureRef.current = null
        gestureCountRef.current = 0
      }
    } catch (err) {
      console.error("Detection error:", err)
    }

    if (isDetecting) {
      animationFrameRef.current = requestAnimationFrame(detectHands)
    }
  }, [isDetecting, detectionInterval, minConfidence, onGestureDetected])

  // Start detection
  const startDetection = useCallback((video: HTMLVideoElement) => {
    if (!detectorRef.current) {
      setError("Model not loaded. Please load the model first.")
      return
    }
    videoRef.current = video
    setIsDetecting(true)
    lastGestureRef.current = null
    gestureCountRef.current = 0
  }, [])

  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setCurrentGesture(null)
  }, [])

  // Run detection loop when detecting
  useEffect(() => {
    if (isDetecting && detectorRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectHands)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isDetecting, detectHands])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    isModelLoaded,
    isDetecting,
    currentGesture,
    error,
    startDetection,
    stopDetection,
    loadModel,
  }
}
