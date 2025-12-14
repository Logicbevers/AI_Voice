// Mock voice and language data for video creation

export interface Language {
    code: string;
    name: string;
    flag: string;
}

export interface VoiceOption {
    id: string;
    name: string;
    gender: "male" | "female" | "neutral";
    language: string;
    accent?: string;
}

export const languages: Language[] = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es-ES", name: "Spanish (Spain)", flag: "🇪🇸" },
    { code: "es-MX", name: "Spanish (Mexico)", flag: "🇲🇽" },
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
    { code: "it-IT", name: "Italian", flag: "🇮🇹" },
    { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
    { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
    { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
    { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "ar-SA", name: "Arabic", flag: "🇸🇦" },
    { code: "ru-RU", name: "Russian", flag: "🇷🇺" },
];

export const voiceGenders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "neutral", label: "Neutral" },
];

export const voices: VoiceOption[] = [
    { id: "voice-1", name: "Aria", gender: "female", language: "en-US" },
    { id: "voice-2", name: "Davis", gender: "male", language: "en-US" },
    { id: "voice-3", name: "Jenny", gender: "female", language: "en-US" },
    { id: "voice-4", name: "Guy", gender: "male", language: "en-US" },
    { id: "voice-5", name: "Sonia", gender: "female", language: "en-GB", accent: "British" },
    { id: "voice-6", name: "Ryan", gender: "male", language: "en-GB", accent: "British" },
    { id: "voice-7", name: "Isabella", gender: "female", language: "es-ES", accent: "Castilian" },
    { id: "voice-8", name: "Diego", gender: "male", language: "es-MX", accent: "Mexican" },
    { id: "voice-9", name: "Camila", gender: "female", language: "es-MX", accent: "Mexican" },
    { id: "voice-10", name: "Léa", gender: "female", language: "fr-FR", accent: "Parisian" },
    { id: "voice-11", name: "Hugo", gender: "male", language: "fr-FR", accent: "Parisian" },
    { id: "voice-12", name: "Katja", gender: "female", language: "de-DE", accent: "Standard" },
    { id: "voice-13", name: "Conrad", gender: "male", language: "de-DE", accent: "Standard" },
    { id: "voice-14", name: "Bianca", gender: "female", language: "it-IT", accent: "Roman" },
    { id: "voice-15", name: "Francisca", gender: "female", language: "pt-BR", accent: "Brazilian" },
    { id: "voice-16", name: "Nanami", gender: "female", language: "ja-JP" },
    { id: "voice-17", name: "Seo-yeon", gender: "female", language: "ko-KR" },
    { id: "voice-18", name: "Xiaoxiao", gender: "female", language: "zh-CN" },
];

export const videoFormats = [
    { value: "16:9", label: "Landscape (16:9)", description: "Best for YouTube, presentations" },
    { value: "9:16", label: "Portrait (9:16)", description: "Best for TikTok, Instagram Stories" },
    { value: "1:1", label: "Square (1:1)", description: "Best for Instagram, Facebook" },
];

export const backgroundOptions = [
    { id: "bg-1", type: "color", value: "#667eea", label: "Purple Gradient" },
    { id: "bg-2", type: "color", value: "#f093fb", label: "Pink Gradient" },
    { id: "bg-3", type: "color", value: "#4facfe", label: "Blue Gradient" },
    { id: "bg-4", type: "color", value: "#43e97b", label: "Green Gradient" },
    { id: "bg-5", type: "color", value: "#ffffff", label: "White" },
    { id: "bg-6", type: "color", value: "#1a1a1a", label: "Dark" },
];
