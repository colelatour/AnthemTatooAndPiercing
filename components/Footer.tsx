import React from 'react';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
  description: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  mapUrl: string;
  phone: string;
  email: string;
}

const Footer: React.FC<FooterProps> = ({
  description,
  instagramUrl,
  facebookUrl,
  address,
  mapUrl,
  phone,
  email
}) => {
  return (
    <footer className="bg-ink-dark border-t border-ink-slate py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-200">
        
        {/* Brand */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-serif text-ink-gold">ANTHEM TATTOO & PIERCING</h3>
          <p className="text-sm">{description}</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-lg font-bold text-gray-200">Studio Info</h4>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-ink-gold transition-colors">
            <MapPin size={18} className="text-ink-gold" />
            <span>{address}</span>
          </a>
          <div className="flex items-center space-x-2">
            <Phone size={18} className="text-ink-gold" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={18} className="text-ink-gold" />
            <span>{email}</span>
          </div>
        </div>

        {/* Socials & Hours */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-lg font-bold text-gray-200">Hours & Socials</h4>
          <p className="text-sm">Mon - Sun: Appointment Only</p>
          <div className="flex space-x-4 mt-2">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink-gold transition-colors"><Instagram /></a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink-gold transition-colors"><Facebook /></a>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 text-xs text-gray-200">
        © {new Date().getFullYear()} Anthem Tattoo and Piercing. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
