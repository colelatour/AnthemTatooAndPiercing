import { Artist, Service, Specialty } from './types';

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  tattoo: 'Tattoo',
  piercing: 'Piercing',
  permanentjewerly: 'Permanent Jewelry'
};

export const SPECIALTY_OPTIONS: { value: Specialty; label: string }[] = [
  { value: 'tattoo', label: 'Tattoo' },
  { value: 'piercing', label: 'Piercing' },
  { value: 'permanentjewerly', label: 'Permanent Jewelry' }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: '1',
    url: 'https://picsum.photos/id/64/600/800',
    name: 'Marcus Reed',
    specialty: ['tattoo'],
    bio: 'Specializing in neo-traditional and Japanese styles with over 10 years of experience. Marcus brings bold colors and intricate detail to every piece.',
    favoriteProjects: [
      { id: 'p1-1', url: 'https://picsum.photos/id/103/600/800', title: 'Traditional Rose' },
      { id: 'p1-2', url: 'https://picsum.photos/id/106/600/800', title: 'Geometric Wolf' },
      { id: 'p1-3', url: 'https://picsum.photos/id/234/600/800', title: 'Blackwork Sleeve' }
    ]
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/91/600/800',
    name: 'Sage Winters',
    specialty: ['piercing'],
    bio: 'Certified piercer with expertise in anatomy and placement. Sage creates beautiful ear curations and specializes in complex piercing projects.',
    favoriteProjects: [
      { id: 'p2-1', url: 'https://picsum.photos/id/338/600/800', title: 'Septum Piercing' },
      { id: 'p2-2', url: 'https://picsum.photos/id/65/600/800', title: 'Ear Curation' },
      { id: 'p2-3', url: 'https://picsum.photos/id/180/600/800', title: 'Industrial Setup' }
    ]
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/177/600/800',
    name: 'Luna Chen',
    specialty: ['tattoo'],
    bio: 'Fine line and micro-realism artist. Luna specializes in delicate, minimalist designs and intricate botanical work.',
    favoriteProjects: [
      { id: 'p3-1', url: 'https://picsum.photos/id/164/600/800', title: 'Watercolor Splash' },
      { id: 'p3-2', url: 'https://picsum.photos/id/222/600/800', title: 'Fine Line Florals' },
      { id: 'p3-3', url: 'https://picsum.photos/id/241/600/800', title: 'Minimalist Portrait' }
    ]
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
    iconName: 'diamond'
  },
  {
    id: 's3',
    title: 'Consultations',
    priceRange: 'Free',
    description: '30-minute sessions to discuss your ideas, placement, and pricing.',
    iconName: 'sparkles'
  }
];
