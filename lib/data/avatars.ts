// Mock avatar data for video creation
export interface Avatar {
    id: string;
    name: string;
    gender: "male" | "female";
    style: "professional" | "casual" | "friendly";
    thumbnail: string;
    description: string;
}

export const avatars: Avatar[] = [
    {
        id: "avatar-1",
        name: "Sarah",
        gender: "female",
        style: "professional",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        description: "Professional female presenter with a warm, engaging presence",
    },
    {
        id: "avatar-2",
        name: "Michael",
        gender: "male",
        style: "professional",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        description: "Confident male presenter perfect for business content",
    },
    {
        id: "avatar-3",
        name: "Emma",
        gender: "female",
        style: "friendly",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        description: "Friendly and approachable female presenter",
    },
    {
        id: "avatar-4",
        name: "James",
        gender: "male",
        style: "casual",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        description: "Casual male presenter with a relaxed style",
    },
    {
        id: "avatar-5",
        name: "Olivia",
        gender: "female",
        style: "professional",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
        description: "Polished female presenter ideal for corporate videos",
    },
    {
        id: "avatar-6",
        name: "David",
        gender: "male",
        style: "friendly",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        description: "Friendly male presenter with great energy",
    },
    {
        id: "avatar-7",
        name: "Sophia",
        gender: "female",
        style: "casual",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
        description: "Energetic and creative presenter for lifestyle content",
    },
    {
        id: "avatar-8",
        name: "Alexander",
        gender: "male",
        style: "professional",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
        description: "Distinguished male presenter for executive communications",
    },
    {
        id: "avatar-9",
        name: "Isabella",
        gender: "female",
        style: "friendly",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
        description: "Warm and personable presenter for educational content",
    },
    {
        id: "avatar-10",
        name: "William",
        gender: "male",
        style: "casual",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
        description: "Laid-back presenter perfect for tech and gaming content",
    },
    {
        id: "avatar-11",
        name: "Charlotte",
        gender: "female",
        style: "professional",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte",
        description: "Sophisticated presenter for luxury and premium brands",
    },
    {
        id: "avatar-12",
        name: "Benjamin",
        gender: "male",
        style: "friendly",
        thumbnail: "https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin",
        description: "Approachable presenter for customer service and support videos",
    },
];
