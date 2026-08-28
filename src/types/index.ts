export interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  popular?: boolean;
  discount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  contentCount: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'installation' | 'devices' | 'payment' | 'general';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: Plan;
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  expiresAt: string;
}

export interface ContactInfo {
  whatsapp: string;
  email: string;
  phone?: string;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export type ResellerLevel = 'iniciante' | 'intermediario' | 'profissional' | 'master';

export interface ResellerTier {
  id: ResellerLevel;
  name: string;
  minPurchases: number;
  pricePerActivation: number;
  suggestedSalePrice: number;
  averageProfit: number;
  features: string[];
  color: string;
}