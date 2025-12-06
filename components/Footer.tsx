import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-dark border-t border-ink-slate py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400">
        
        {/* Brand */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-serif text-ink-gold">ANTHEM TATTOO & PIERCING</h3>
          <p className="text-sm">
            Premium custom tattooing and professional body piercing in the heart of the city. 
            Where art meets skin.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-lg font-bold text-gray-200">Studio Info</h4>
          <div className="flex items-center space-x-2">
            <MapPin size={18} className="text-ink-gold" />
            <span>123 Obsidian Ave, Dark District, NY</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={18} className="text-ink-gold" />
            <span>(555) 666-0123</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={18} className="text-ink-gold" />
            <span>booking@anthemtattoo.com</span>
          </div>
        </div>

        {/* Socials & Hours */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-lg font-bold text-gray-200">Hours & Socials</h4>
          <p className="text-sm">Tue - Sat: 11:00 AM - 8:00 PM</p>
          <p className="text-sm">Sun - Mon: Appointment Only</p>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-ink-gold transition-colors"><Instagram /></a>
            <a href="#" className="hover:text-ink-gold transition-colors"><Facebook /></a>
            <a href="#" className="hover:text-ink-gold transition-colors"><Twitter /></a>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 text-xs text-gray-600">
        © {new Date().getFullYear()} Anthem Tattoo and Piercing. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;