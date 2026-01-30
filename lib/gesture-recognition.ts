// Gesture recognition using hand landmark analysis
// Based on the 21 hand landmarks from MediaPipe Hands model

export interface HandLandmark {
  x: number
  y: number
  z?: number
}

export interface HandKeypoints {
  // Wrist
  wrist: HandLandmark
  // Thumb (4 points)
  thumbCMC: HandLandmark
  thumbMCP: HandLandmark
  thumbIP: HandLandmark
  thumbTip: HandLandmark
  // Index finger (4 points)
  indexMCP: HandLandmark
  indexPIP: HandLandmark
  indexDIP: HandLandmark
  indexTip: HandLandmark
  // Middle finger (4 points)
  middleMCP: HandLandmark
  middlePIP: HandLandmark
  middleDIP: HandLandmark
  middleTip: HandLandmark
  // Ring finger (4 points)
  ringMCP: HandLandmark
  ringPIP: HandLandmark
  ringDIP: HandLandmark
  ringTip: HandLandmark
  // Pinky (4 points)
  pinkyMCP: HandLandmark
  pinkyPIP: HandLandmark
  pinkyDIP: HandLandmark
  pinkyTip: HandLandmark
}

// Convert raw landmarks array to named keypoints
export function parseHandLandmarks(landmarks: number[][]): HandKeypoints {
  return {
    wrist: { x: landmarks[0][0], y: landmarks[0][1], z: landmarks[0][2] },
    thumbCMC: { x: landmarks[1][0], y: landmarks[1][1], z: landmarks[1][2] },
    thumbMCP: { x: landmarks[2][0], y: landmarks[2][1], z: landmarks[2][2] },
    thumbIP: { x: landmarks[3][0], y: landmarks[3][1], z: landmarks[3][2] },
    thumbTip: { x: landmarks[4][0], y: landmarks[4][1], z: landmarks[4][2] },
    indexMCP: { x: landmarks[5][0], y: landmarks[5][1], z: landmarks[5][2] },
    indexPIP: { x: landmarks[6][0], y: landmarks[6][1], z: landmarks[6][2] },
    indexDIP: { x: landmarks[7][0], y: landmarks[7][1], z: landmarks[7][2] },
    indexTip: { x: landmarks[8][0], y: landmarks[8][1], z: landmarks[8][2] },
    middleMCP: { x: landmarks[9][0], y: landmarks[9][1], z: landmarks[9][2] },
    middlePIP: { x: landmarks[10][0], y: landmarks[10][1], z: landmarks[10][2] },
    middleDIP: { x: landmarks[11][0], y: landmarks[11][1], z: landmarks[11][2] },
    middleTip: { x: landmarks[12][0], y: landmarks[12][1], z: landmarks[12][2] },
    ringMCP: { x: landmarks[13][0], y: landmarks[13][1], z: landmarks[13][2] },
    ringPIP: { x: landmarks[14][0], y: landmarks[14][1], z: landmarks[14][2] },
    ringDIP: { x: landmarks[15][0], y: landmarks[15][1], z: landmarks[15][2] },
    ringTip: { x: landmarks[16][0], y: landmarks[16][1], z: landmarks[16][2] },
    pinkyMCP: { x: landmarks[17][0], y: landmarks[17][1], z: landmarks[17][2] },
    pinkyPIP: { x: landmarks[18][0], y: landmarks[18][1], z: landmarks[18][2] },
    pinkyDIP: { x: landmarks[19][0], y: landmarks[19][1], z: landmarks[19][2] },
    pinkyTip: { x: landmarks[20][0], y: landmarks[20][1], z: landmarks[20][2] },
  }
}

// Calculate distance between two points
function distance(p1: HandLandmark, p2: HandLandmark): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow((p1.z || 0) - (p2.z || 0), 2)
  )
}

// Check if a finger is extended (tip is further from wrist than MCP)
function isFingerExtended(
  tip: HandLandmark, 
  pip: HandLandmark, 
  mcp: HandLandmark, 
  wrist: HandLandmark
): boolean {
  const tipToWrist = distance(tip, wrist)
  const mcpToWrist = distance(mcp, wrist)
  const tipToPip = distance(tip, pip)
  const pipToMcp = distance(pip, mcp)
  
  // Finger is extended if tip is further from wrist than MCP
  // and the finger is relatively straight (not curled)
  return tipToWrist > mcpToWrist * 0.9 && tipToPip > pipToMcp * 0.5
}

// Check if thumb is extended
function isThumbExtended(kp: HandKeypoints): boolean {
  const thumbTipToIndex = distance(kp.thumbTip, kp.indexMCP)
  const thumbBaseToIndex = distance(kp.thumbCMC, kp.indexMCP)
  return thumbTipToIndex > thumbBaseToIndex * 0.8
}

// Get finger states (which fingers are extended)
export interface FingerStates {
  thumb: boolean
  index: boolean
  middle: boolean
  ring: boolean
  pinky: boolean
}

export function getFingerStates(kp: HandKeypoints): FingerStates {
  return {
    thumb: isThumbExtended(kp),
    index: isFingerExtended(kp.indexTip, kp.indexPIP, kp.indexMCP, kp.wrist),
    middle: isFingerExtended(kp.middleTip, kp.middlePIP, kp.middleMCP, kp.wrist),
    ring: isFingerExtended(kp.ringTip, kp.ringPIP, kp.ringMCP, kp.wrist),
    pinky: isFingerExtended(kp.pinkyTip, kp.pinkyPIP, kp.pinkyMCP, kp.wrist),
  }
}

// Count extended fingers
export function countExtendedFingers(states: FingerStates): number {
  return [states.thumb, states.index, states.middle, states.ring, states.pinky]
    .filter(Boolean).length
}

// Gesture recognition based on finger states and hand position
export type RecognizedGesture = 
  | "hello" 
  | "thank_you" 
  | "yes" 
  | "no" 
  | "help" 
  | "please" 
  | "good" 
  | "water" 
  | "food"
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "thumbs_up"
  | "peace"
  | "ok"
  | "stop"
  | "pointing"
  | null

export interface GestureResult {
  gesture: RecognizedGesture
  confidence: number
  fingerStates: FingerStates
}

export function recognizeGesture(kp: HandKeypoints): GestureResult {
  const fingers = getFingerStates(kp)
  const extendedCount = countExtendedFingers(fingers)
  
  let gesture: RecognizedGesture = null
  let confidence = 0

  // Open palm (all fingers extended) - Hello / Stop
  if (fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    // Check if palm is facing forward (fingers pointing up)
    if (kp.middleTip.y < kp.wrist.y) {
      gesture = "hello"
      confidence = 0.9
    } else {
      gesture = "stop"
      confidence = 0.85
    }
  }
  // Thumbs up (only thumb extended, pointing up)
  else if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    if (kp.thumbTip.y < kp.thumbCMC.y) {
      gesture = "thumbs_up"
      confidence = 0.95
      // Thumbs up often means "yes" or "good" in sign language
      gesture = "yes"
    } else {
      gesture = "no"
      confidence = 0.8
    }
  }
  // Peace sign / Victory (index and middle extended)
  else if (!fingers.thumb && fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    gesture = "peace"
    confidence = 0.9
    // Two fingers - could mean "two" or "peace"
    gesture = "two"
  }
  // Pointing (only index finger extended)
  else if (!fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    gesture = "one"
    confidence = 0.9
  }
  // Three fingers (index, middle, ring extended)
  else if (!fingers.thumb && fingers.index && fingers.middle && fingers.ring && !fingers.pinky) {
    gesture = "three"
    confidence = 0.9
  }
  // Four fingers (all except thumb)
  else if (!fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    gesture = "four"
    confidence = 0.9
  }
  // OK sign (thumb and index forming circle, others extended)
  else if (fingers.thumb && !fingers.index && fingers.middle && fingers.ring && fingers.pinky) {
    const thumbIndexDist = distance(kp.thumbTip, kp.indexTip)
    const palmSize = distance(kp.wrist, kp.middleMCP)
    if (thumbIndexDist < palmSize * 0.3) {
      gesture = "ok"
      confidence = 0.85
      gesture = "good"
    }
  }
  // Fist (no fingers extended) - could be various signs
  else if (!fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    gesture = "help"
    confidence = 0.7
  }
  // Thumb and pinky extended (call me / phone)
  else if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && fingers.pinky) {
    gesture = "please"
    confidence = 0.8
  }
  // Index and pinky extended (rock on / horns)
  else if (!fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && fingers.pinky) {
    gesture = "water"
    confidence = 0.7
  }
  // Thumb, index, middle extended
  else if (fingers.thumb && fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    gesture = "three"
    confidence = 0.85
  }
  // Number based on finger count as fallback
  else {
    switch (extendedCount) {
      case 1:
        gesture = "one"
        confidence = 0.7
        break
      case 2:
        gesture = "two"
        confidence = 0.7
        break
      case 3:
        gesture = "three"
        confidence = 0.7
        break
      case 4:
        gesture = "four"
        confidence = 0.7
        break
      case 5:
        gesture = "five"
        confidence = 0.7
        break
    }
  }

  return { gesture, confidence, fingerStates: fingers }
}

// Gesture dictionary with translations
export const gestureTranslations: Record<string, { en: string; hi: string; ta: string }> = {
  "hello": { en: "Hello", hi: "नमस्ते", ta: "வணக்கம்" },
  "thank_you": { en: "Thank You", hi: "धन्यवाद", ta: "நன்றி" },
  "please": { en: "Please", hi: "कृपया", ta: "தயவுசெய்து" },
  "help": { en: "I need help", hi: "मुझे मदद चाहिए", ta: "எனக்கு உதவி வேண்டும்" },
  "yes": { en: "Yes", hi: "हां", ta: "ஆம்" },
  "no": { en: "No", hi: "नहीं", ta: "இல்லை" },
  "water": { en: "Water", hi: "पानी", ta: "தண்ணீர்" },
  "food": { en: "Food", hi: "खाना", ta: "உணவு" },
  "good": { en: "Good", hi: "अच्छा", ta: "நல்லது" },
  "thumbs_up": { en: "Good / Yes", hi: "अच्छा / हां", ta: "நல்லது / ஆம்" },
  "peace": { en: "Peace / Victory", hi: "शांति / जीत", ta: "அமைதி / வெற்றி" },
  "ok": { en: "OK / Understood", hi: "ठीक है / समझ गया", ta: "சரி / புரிந்தது" },
  "stop": { en: "Stop", hi: "रुको", ta: "நிறுத்து" },
  "pointing": { en: "There / That", hi: "वहाँ / वो", ta: "அங்கே / அது" },
  "one": { en: "One", hi: "एक", ta: "ஒன்று" },
  "two": { en: "Two", hi: "दो", ta: "இரண்டு" },
  "three": { en: "Three", hi: "तीन", ta: "மூன்று" },
  "four": { en: "Four", hi: "चार", ta: "நான்கு" },
  "five": { en: "Five", hi: "पाँच", ta: "ஐந்து" },
}
