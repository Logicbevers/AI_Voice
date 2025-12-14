import { Avatar, avatars } from "./avatars";

export interface VoiceSettings {
    language: string;
    gender: string;
    speed: number;
    pitch: number;
}

export interface VideoSettings {
    format: string;
    background: string;
    subtitles: boolean;
}

export interface VideoTemplate {
    id: string;
    name: string;
    description: string;
    category: "Marketing" | "Education" | "Social Media" | "Business" | "Personal";
    thumbnail: string;
    script: string;
    avatar: Avatar;
    voiceSettings: VoiceSettings;
    videoSettings: VideoSettings;
    tags: string[];
    useCases: string[];
    estimatedDuration: number; // in seconds
}

export const templates: VideoTemplate[] = [
    {
        id: "template-1",
        name: "Product Demo",
        description: "Showcase your product features and benefits",
        category: "Marketing",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
        script: "Introducing our revolutionary product! Our solution helps you achieve amazing results. With features like advanced analytics, seamless integration, and 24/7 support, you'll be able to transform your workflow. Try it today and see the difference!",
        avatar: avatars[0], // Sarah - Professional female
        voiceSettings: {
            language: "en-US",
            gender: "female",
            speed: 1.0,
            pitch: 0,
        },
        videoSettings: {
            format: "16:9",
            background: "#667eea",
            subtitles: true,
        },
        tags: ["product", "demo", "marketing", "features"],
        useCases: ["Product launches", "Feature announcements", "Sales presentations"],
        estimatedDuration: 30,
    },
    {
        id: "template-2",
        name: "How-To Tutorial",
        description: "Step-by-step instructional video",
        category: "Education",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
        script: "Hi! Today I'll show you how to master this skill. First, start by understanding the basics. Next, practice the key techniques. Finally, apply what you've learned. And that's it! You've successfully completed the tutorial.",
        avatar: avatars[2], // Emma - Friendly female
        voiceSettings: {
            language: "en-US",
            gender: "female",
            speed: 0.9,
            pitch: 0,
        },
        videoSettings: {
            format: "16:9",
            background: "#4facfe",
            subtitles: true,
        },
        tags: ["tutorial", "education", "how-to", "learning"],
        useCases: ["Online courses", "Training videos", "Skill development"],
        estimatedDuration: 45,
    },
    {
        id: "template-3",
        name: "Social Media Promo",
        description: "Quick promotional video for social media",
        category: "Social Media",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
        script: "Hey everyone! 🎉 Exciting news! We've just launched something amazing that you don't want to miss. Check it out now and be part of the revolution. Link in bio!",
        avatar: avatars[6], // Sophia - Casual female
        voiceSettings: {
            language: "en-US",
            gender: "female",
            speed: 1.1,
            pitch: 2,
        },
        videoSettings: {
            format: "9:16",
            background: "#f093fb",
            subtitles: true,
        },
        tags: ["social", "promo", "short", "viral"],
        useCases: ["Instagram Stories", "TikTok", "YouTube Shorts", "Reels"],
        estimatedDuration: 15,
    },
    {
        id: "template-4",
        name: "Business Announcement",
        description: "Professional company announcement",
        category: "Business",
        thumbnail: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop",
        script: "Good morning team. I'm pleased to announce an important update regarding our company. This strategic decision will help us achieve our goals and deliver better value to our customers. Thank you for your continued dedication.",
        avatar: avatars[7], // Alexander - Professional male
        voiceSettings: {
            language: "en-US",
            gender: "male",
            speed: 1.0,
            pitch: 0,
        },
        videoSettings: {
            format: "16:9",
            background: "#1a1a1a",
            subtitles: true,
        },
        tags: ["business", "announcement", "corporate", "professional"],
        useCases: ["Company updates", "Team announcements", "Stakeholder communications"],
        estimatedDuration: 25,
    },
    {
        id: "template-5",
        name: "Welcome Message",
        description: "Warm welcome for new members or customers",
        category: "Personal",
        thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=450&fit=crop",
        script: "Welcome! We're so excited to have you here. Thank you for joining our community. We can't wait to help you on your journey. If you have any questions, we're always here to help. Let's get started!",
        avatar: avatars[8], // Isabella - Friendly female
        voiceSettings: {
            language: "en-US",
            gender: "female",
            speed: 1.0,
            pitch: 1,
        },
        videoSettings: {
            format: "16:9",
            background: "#43e97b",
            subtitles: true,
        },
        tags: ["welcome", "greeting", "onboarding", "personal"],
        useCases: ["Customer onboarding", "New member welcome", "Community greetings"],
        estimatedDuration: 20,
    },
    {
        id: "template-6",
        name: "Course Introduction",
        description: "Introduce your online course",
        category: "Education",
        thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop",
        script: "Welcome to this comprehensive course! Over the next few lessons, you'll learn essential skills that will transform your expertise. We'll cover everything from fundamentals to advanced techniques. By the end, you'll be fully equipped to succeed. Let's begin!",
        avatar: avatars[4], // Olivia - Professional female
        voiceSettings: {
            language: "en-US",
            gender: "female",
            speed: 0.95,
            pitch: 0,
        },
        videoSettings: {
            format: "16:9",
            background: "#667eea",
            subtitles: true,
        },
        tags: ["course", "education", "introduction", "learning"],
        useCases: ["Course intros", "Module previews", "Educational content"],
        estimatedDuration: 35,
    },
    {
        id: "template-7",
        name: "Product Review",
        description: "Honest product review and recommendation",
        category: "Marketing",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop",
        script: "Hey everyone! Today I'm reviewing this amazing product. After using it for a while, I'm impressed by its quality and performance. The best features are its ease of use and excellent results. I highly recommend giving it a try!",
        avatar: avatars[9], // William - Casual male
        voiceSettings: {
            language: "en-US",
            gender: "male",
            speed: 1.0,
            pitch: 0,
        },
        videoSettings: {
            format: "16:9",
            background: "#4facfe",
            subtitles: true,
        },
        tags: ["review", "product", "recommendation", "casual"],
        useCases: ["Product reviews", "Testimonials", "Recommendations"],
        estimatedDuration: 40,
    },
    {
        id: "template-8",
        name: "Event Invitation",
        description: "Invite people to your event",
        category: "Personal",
        thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=450&fit=crop",
        script: "You're invited! Join us for an amazing event that you won't want to miss. We've planned something special and we'd love to see you there. Save the date and get ready for an unforgettable experience. See you soon!",
        avatar: avatars[3], // James - Casual male
        voiceSettings: {
            language: "en-US",
            gender: "male",
            speed: 1.05,
            pitch: 1,
        },
        videoSettings: {
            format: "9:16",
            background: "#f093fb",
            subtitles: true,
        },
        tags: ["invitation", "event", "personal", "celebration"],
        useCases: ["Event invitations", "Party announcements", "Webinar promotions"],
        estimatedDuration: 18,
    },
    {
        id: "template-9",
        name: "Company Update",
        description: "Share important company news",
        category: "Business",
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
        script: "Hello everyone. I wanted to share some exciting updates about our company's progress. We've achieved significant milestones this quarter and are on track to exceed our goals. Thank you all for your hard work and dedication. Together, we're building something great.",
        avatar: avatars[1], // Michael - Professional male
        voiceSettings: {
            language: "en-US",
            gender: "male",
            speed: 0.95,
            pitch: 0,
        },
        videoSettings: {
            format: "16:9",
            background: "#667eea",
            subtitles: true,
        },
        tags: ["update", "business", "corporate", "news"],
        useCases: ["Quarterly updates", "Company news", "Team communications"],
        estimatedDuration: 30,
    },
    {
        id: "template-10",
        name: "Quick Tip",
        description: "Share a quick helpful tip",
        category: "Education",
        thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop",
        script: "Quick tip! Here's a simple trick that will save you tons of time. Instead of doing it the hard way, try this method. It's faster, easier, and gets better results. Give it a try and let me know how it works for you!",
        avatar: avatars[11], // Benjamin - Friendly male
        voiceSettings: {
            language: "en-US",
            gender: "male",
            speed: 1.1,
            pitch: 1,
        },
        videoSettings: {
            format: "9:16",
            background: "#43e97b",
            subtitles: true,
        },
        tags: ["tip", "quick", "education", "short"],
        useCases: ["Quick tips", "Life hacks", "Pro tips", "Short tutorials"],
        estimatedDuration: 12,
    },
];

export const templateCategories = [
    { value: "all", label: "All Templates" },
    { value: "Marketing", label: "Marketing" },
    { value: "Education", label: "Education" },
    { value: "Social Media", label: "Social Media" },
    { value: "Business", label: "Business" },
    { value: "Personal", label: "Personal" },
];
