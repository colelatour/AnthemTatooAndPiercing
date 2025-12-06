export interface ArtistProject {
  id: string;
  url: string;
  title: string;
}

export interface Artist {
  id: string;
  url: string;
  name: string;
  specialty: 'tattoo' | 'piercing';
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

export interface JewelryItem {
  id: string;
  url: string;
  title: string;
  description?: string;
}

export enum ViewState {
  HOME = 'HOME',
  TEAM = 'TEAM',
  JEWELRY = 'JEWELRY',
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN'
}
