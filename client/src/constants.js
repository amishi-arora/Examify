export const QUESTION_TYPES = {
    MC: "Multiple choice",
    SHORT: "Short answer"
}

export const SCORE_COLORS = {
    HIGH: {
        full: "border-green-600 bg-green-50 text-green-900",
        text: "text-green-900",
        bg: "bg-green-50",
        border: "border-green-600"
    },
    MID: {
        full: "border-amber-600 text-amber-600 bg-amber-50",
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-600"
    },
    LOW: {
        full: "border-red-600 bg-red-50 text-red-900",
        text: "text-red-900",
        bg: "bg-red-50",
        border: "border-red-600"
    }
}

export const BASE_URL = "http://localhost:3001"

export const DEFAULT_EXAM_SETTINGS = {
    difficulty: "Medium",
    multipleChoice: "5",
    shortAnswer: "5",
    focusTopics: "",
    additionalInstructions: "",
    time: "0"
}