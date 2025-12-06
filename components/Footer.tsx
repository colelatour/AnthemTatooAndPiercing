import React from 'react';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

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
          <a href="https://maps.app.goo.gl/kt9J9kKnSjssUYKh7" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-ink-gold transition-colors">
            <MapPin size={18} className="text-ink-gold" />
            <span>640 N Main St Suite 231, North Salt Lake, UT 84054
            </span>
          </a>
          <div className="flex items-center space-x-2">
            <Phone size={18} className="text-ink-gold" />
            <span> (801) 247-5896</span>
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
            <a href="https://www.instagram.com/anthempiercingandtattoo?igsh=czg0dmJybXJ5bDJ6" target="_blank" rel="noopener noreferrer" className="hover:text-ink-gold transition-colors"><Instagram /></a>
            <a href="https://www.facebook.com/AnthemTats/" target="_blank" rel="noopener noreferrer" className="hover:text-ink-gold transition-colors"><Facebook /></a>
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