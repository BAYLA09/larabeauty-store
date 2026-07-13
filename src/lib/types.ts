export interface ProductOffer {
  id: string;
  quantity: number;
  label: string;
  subtitle: string;
  price: number;
  compareAtPrice: number;
  badge: string;
  defaultSelected?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  routineNameLocal: string;
  routineNameEnglish: string;
  category: string;
  format: string;
  targetCustomer: string;
  problem: string;
  emotionalPain: string;
  desiredOutcome: string;
  mainIngredient: string;
  ingredientStack: Array<{
    name: string;
    dosage?: string;
    benefit: string;
    proof: string;
  }>;
  mechanism: string;
  cardHeadline: string;
  cardSubheadline: string;
  heroHeadline: string;
  heroSubheadline: string;
  rating: number;
  reviewsCount: number;
  badges: string[];
  offers: ProductOffer[];
  upsell: {
    enabled: boolean;
    price: number;
    label: string;
    subtitle: string;
  };
  collectionImage: string;
  collectionImageAlt: string;
  images: Record<string, string>;
  imageAlts: Record<string, string>;
  placeholderHue: "indigo" | "amber" | "teal";
  exclusions: string[];
  authority: {
    certifications: string[];
    expertTitle: string;
    expertQuote: string;
    stats: Array<{ value: string; label: string }>;
  };
  timeline: Array<{ label: string; text: string }>;
  problemCards: Array<{ pain: string; solution: string }>;
  failureAlternatives: Array<{
    name: string;
    priceNote: string;
    points: string[];
  }>;
  testimonials: Array<{
    quote: string;
    name: string;
    meta: string;
    initial: string;
  }>;
  insightStat?: {
    value: string;
    label: string;
    source?: string;
  };
  scarcityLine: string;
  delivery: {
    cities: string[];
    carriers: string[];
  };
  relatedSlugs: string[];
}
