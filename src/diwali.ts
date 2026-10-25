export const diwaliAudiences = ['Men', 'Women', 'Girls', 'Boys', 'Custom / Family'] as const;
export type DiwaliAudience = typeof diwaliAudiences[number];
export type ClothingAudience = Exclude<DiwaliAudience, 'Custom / Family'>;
export type GarmentAngle = 'left' | 'front' | 'right';
export const garmentAngles: GarmentAngle[] = ['left', 'front', 'right'];
export interface DiwaliCollectionItem {
  id: string; audience: ClothingAudience; name: string; type: string;
  color: string; colorName: string; description: string;
  images: Record<GarmentAngle, string>; thumbnail: string;
  availableSizes: { size: string; count: number }[];
}
type ProductSeed = [string, ClothingAudience, string, string, string, string];
const pieces: ProductSeed[] = [
  [
    "men-1",
    "Men",
    "Emerald Heritage Kurta",
    "Kurta set",
    "#214336",
    "Forest green"
  ],
  [
    "men-2",
    "Men",
    "Ivory Nehru Jacket Set",
    "Jacket set",
    "#d9c9a4",
    "Ivory gold"
  ],
  [
    "men-3",
    "Men",
    "Midnight Kurta Pajama",
    "Kurta set",
    "#28344d",
    "Midnight blue"
  ],
  [
    "men-4",
    "Men",
    "Maroon Celebration Sherwani",
    "Sherwani set",
    "#7c2135",
    "Maroon"
  ],
  [
    "men-5",
    "Men",
    "Teal Festive Kurta",
    "Kurta set",
    "#087e8b",
    "Teal"
  ],
  [
    "women-1",
    "Women",
    "Ruby Embroidered Lehenga",
    "Lehenga set",
    "#a7224d",
    "Ruby"
  ],
  [
    "women-2",
    "Women",
    "Emerald Sari Ensemble",
    "Sari set",
    "#07594b",
    "Emerald"
  ],
  [
    "women-3",
    "Women",
    "Royal Blue Lehenga",
    "Lehenga set",
    "#214a86",
    "Royal blue"
  ],
  [
    "women-4",
    "Women",
    "Rose Celebration Anarkali",
    "Anarkali dress",
    "#c74261",
    "Rose"
  ],
  [
    "women-5",
    "Women",
    "Teal Sharara Set",
    "Sharara set",
    "#087e8b",
    "Teal"
  ],
  [
    "girls-1",
    "Girls",
    "Pink Star Lehenga",
    "Lehenga set",
    "#d94373",
    "Pink"
  ],
  [
    "girls-2",
    "Girls",
    "Golden Party Dress",
    "Festive dress",
    "#e9b637",
    "Golden yellow"
  ],
  [
    "girls-3",
    "Girls",
    "Turquoise Sharara",
    "Sharara set",
    "#19a7ac",
    "Turquoise"
  ],
  [
    "girls-4",
    "Girls",
    "Coral Twirl Lehenga",
    "Lehenga set",
    "#e45b75",
    "Coral pink"
  ],
  [
    "girls-5",
    "Girls",
    "Violet Celebration Lehenga",
    "Lehenga set",
    "#653e8e",
    "Violet"
  ],
  [
    "boys-1",
    "Boys",
    "Mustard Kurta Pajama",
    "Kurta set",
    "#d4a110",
    "Mustard"
  ],
  [
    "boys-2",
    "Boys",
    "Teal Nehru Jacket Set",
    "Jacket set",
    "#125c67",
    "Teal"
  ],
  [
    "boys-3",
    "Boys",
    "Coral Festive Kurta",
    "Kurta set",
    "#ce5747",
    "Coral"
  ],
  [
    "boys-4",
    "Boys",
    "Navy Diwali Kurta",
    "Kurta set",
    "#263b68",
    "Navy"
  ],
  [
    "boys-5",
    "Boys",
    "Forest Green Kurta Set",
    "Kurta set",
    "#24513c",
    "Forest green"
  ]
];

// Demo designs and quantities, not live stock. Every angle is a separate complete asset.
export const diwaliCollections: DiwaliCollectionItem[] = pieces.map(([id, audience, name, type, color, colorName], index) => ({
  id, audience, name, type, color, colorName,
  description: `${colorName} tones, delicate festive detailing and an easy silhouette. A ${type.toLowerCase()} for your celebration edit.`,
  thumbnail: `/garments/${id}-rack.webp`,
  images: { front: `/garments/${id}-front.webp`, left: `/garments/${id}-left.webp`, right: `/garments/${id}-right.webp` },
  availableSizes: (audience === 'Men' || audience === 'Women' ? ['S', 'M', 'L', 'XL'] : ['2–4 years', '5–7 years', '8–10 years'])
    .map((size, position) => ({ size, count: [3, 5, 2, 1][(index + position) % 4] })),
}));
export const collectionFor = (audience: ClothingAudience) => diwaliCollections.filter(item => item.audience === audience);
export const occasions = [
  { id: 'diwali', label: 'Diwali', caption: 'A little light. A lot of celebration.', detail: 'Warm gold & festive lights' },
  { id: 'wedding', label: 'Wedding', caption: 'Dressed for beautiful beginnings.', detail: 'Blush arches & soft florals' },
  { id: 'everyday', label: 'Everyday', caption: 'Your own little corner of style.', detail: 'Sage linen & natural light' },
] as const;
export type Occasion = typeof occasions[number]['id'];
export interface FamilyMember { id: number; productId: string; size: string }
export const MAX_FAMILY_MEMBERS = 5;
