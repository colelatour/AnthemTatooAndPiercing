export interface ArtistProject {
  id: string;
  url: string;
  title: string;
}

export type Specialty = 'tattoo' | 'piercing' | 'permanentjewerly';

export interface Artist {
  id: string;
  url: string;
  name: string;
  specialty: Specialty[];
  bio?: string;
  favoriteProjects: ArtistProject[];
}

export interface Service {
  id: string;
  title: string;
  priceRange: string;
  description: string;
  iconName: string;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export type JewelryTag = 'permanent' | 'piercing';

export interface JewelryItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  tag?: JewelryTag;
}

export interface HomepageContent {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  button1Text: string;
  button2Text: string;
  promotionTitle: string;
  promotionText: string;
  promotionImage: string;
  services: Service[];
  footerDescription: string;
  footerHours: string[];
  footerInstagramUrl: string;
  footerFacebookUrl: string;
  footerAddress: string;
  footerMapUrl: string;
  footerPhone: string;
  footerEmail: string;
}

export enum ViewState {
  HOME = 'HOME',
  TEAM = 'TEAM',
  JEWELRY = 'JEWELRY',
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN'
}
