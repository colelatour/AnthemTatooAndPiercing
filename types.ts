export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: 'tattoo' | 'piercing';
  description?: string;
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

export enum ViewState {
  HOME = 'HOME',
  PORTFOLIO = 'PORTFOLIO',
  ADMIN = 'ADMIN',
  LOGIN = 'LOGIN'
}
