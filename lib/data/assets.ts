// Mock asset data
export interface Asset {
    id: string;
    name: string;
    type: "image" | "logo" | "video" | "audio";
    url: string;
    thumbnail: string;
    size: number; // in bytes
    createdAt: Date;
    tags: string[];
}

export const mockAssets: Asset[] = [
    {
        id: "asset-1",
        name: "Company Logo",
        type: "logo",
        url: "https://via.placeholder.com/400x400/667eea/ffffff?text=Logo",
        thumbnail: "https://via.placeholder.com/200x200/667eea/ffffff?text=Logo",
        size: 45000,
        createdAt: new Date("2024-01-15"),
        tags: ["branding", "logo"],
    },
    {
        id: "asset-2",
        name: "Product Image",
        type: "image",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
        size: 125000,
        createdAt: new Date("2024-01-20"),
        tags: ["product", "marketing"],
    },
    {
        id: "asset-3",
        name: "Background Pattern",
        type: "image",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
        thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=200",
        size: 89000,
        createdAt: new Date("2024-02-01"),
        tags: ["background", "design"],
    },
    {
        id: "asset-4",
        name: "Brand Colors",
        type: "image",
        url: "https://via.placeholder.com/800x400/4facfe/ffffff?text=Brand+Colors",
        thumbnail: "https://via.placeholder.com/200x100/4facfe/ffffff?text=Colors",
        size: 12000,
        createdAt: new Date("2024-02-10"),
        tags: ["branding", "colors"],
    },
];

export const assetTypes = [
    { value: "all", label: "All Assets" },
    { value: "logo", label: "Logos" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "audio", label: "Audio" },
];
