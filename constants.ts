import { PortfolioItem, Service } from './types';

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    url: 'https://picsum.photos/id/103/600/800',
    title: 'Traditional Rose',
    category: 'tattoo',
    description: 'Neo-traditional style rose on forearm.'
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/106/600/800',
    title: 'Geometric Wolf',
    category: 'tattoo',
    description: 'Fine line geometric work.'
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/338/600/800',
    title: 'Septum Piercing',
    category: 'piercing',
    description: 'Gold clicker jewelry.'
  },
  {
    id: '4',
    url: 'https://picsum.photos/id/234/600/800',
    title: 'Blackwork Sleeve',
    category: 'tattoo',
    description: 'Heavy blackwork and negative space.'
  },
  {
    id: '5',
    url: 'https://picsum.photos/id/65/600/800',
    title: 'Ear Curation',
    category: 'piercing',
    description: 'Triple lobe and helix setup.'
  },
  {
    id: '6',
    url: 'https://picsum.photos/id/164/600/800',
    title: 'Watercolor Splash',
    category: 'tattoo',
    description: 'Abstract watercolor overlay.'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Custom Tattoo',
    priceRange: '$150/hr',
    description: 'Bespoke designs created by our award-winning artists tailored to your vision.',
    iconName: 'pen-tool'
  },
  {
    id: 's2',
    title: 'Body Piercing',
    priceRange: '$40 - $120',
    description: 'Professional piercing services using implant-grade titanium jewelry.',
    iconName: 'anchor'
  },
  {
    id: 's3',
    title: 'Consultations',
    priceRange: 'Free',
    description: '30-minute sessions to discuss your ideas, placement, and pricing.',
    iconName: 'message-circle'
  }
];
