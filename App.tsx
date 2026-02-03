// To run website use: npm run dev

import React, { useState, useEffect } from 'react';
import { Menu, X, Anchor, PenTool, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { ViewState, Artist, JewelryItem, User, HomepageContent, Specialty, JewelryTag } from './types';
import { INITIAL_ARTISTS, SERVICES, SPECIALTY_LABELS } from './constants';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const normalizeSpecialties = (specialties?: Specialty[] | Specialty) => {
    if (!specialties) return ['tattoo'];
    if (Array.isArray(specialties)) {
      return specialties.length ? specialties : ['tattoo'];
    }
    return [specialties];
  };

  const formatSpecialties = (specialties: Specialty[]) => (
    specialties.map(specialty => SPECIALTY_LABELS[specialty] ?? specialty).join(', ')
  );

  const [artists, setArtists] = useState<Artist[]>(() => {
    const saved = localStorage.getItem('artists');
    const baseArtists = saved ? JSON.parse(saved) : INITIAL_ARTISTS;
    return baseArtists.map((artist: Artist) => ({
      ...artist,
      specialty: normalizeSpecialties((artist as Artist & { specialty?: Specialty[] | Specialty }).specialty)
    }));
  });

  const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>(() => {
    const saved = localStorage.getItem('jewelry_items');
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed)
      ? parsed.map((item: JewelryItem) => ({
          ...item,
          tag: (item.tag as JewelryTag) ?? 'piercing'
        }))
      : [];
  });

  const [homepageContent, setHomepageContent] = useState<HomepageContent>(() => {
    const saved = localStorage.getItem('homepage_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure services is always an array
        if (!parsed.services || !Array.isArray(parsed.services)) {
          parsed.services = SERVICES;
        }
        if (!parsed.footerDescription) {
          parsed.footerDescription = 'Premium custom tattooing and professional body piercing in the heart of the city. Where art meets skin.';
        }
        if (!parsed.footerHours || !Array.isArray(parsed.footerHours)) {
          parsed.footerHours = ['Tue - Sat: 11:00 AM - 8:00 PM', 'Sun - Mon: Appointment Only'];
        }
        if (!parsed.footerInstagramUrl) {
          parsed.footerInstagramUrl = 'https://www.instagram.com/anthempiercingandtattoo?igsh=czg0dmJybXJ5bDJ6';
        }
        if (!parsed.footerFacebookUrl) {
          parsed.footerFacebookUrl = 'https://www.facebook.com/AnthemTats/';
        }
        if (!parsed.footerAddress) {
          parsed.footerAddress = '640 N Main St Suite 231, North Salt Lake, UT 84054';
        }
        if (!parsed.footerMapUrl) {
          parsed.footerMapUrl = 'https://maps.app.goo.gl/kt9J9kKnSjssUYKh7';
        }
        if (!parsed.footerPhone) {
          parsed.footerPhone = '(801) 247-5896';
        }
        if (!parsed.footerEmail) {
          parsed.footerEmail = 'booking@anthemtattoo.com';
        }
        return parsed;
      } catch (e) {
        // If parsing fails, return default
        return {
          heroImage: 'https://picsum.photos/id/1/1920/1080',
          heroTitle: 'ELEVATE YOUR AESTHETIC',
          heroSubtitle: 'Premium Custom Tattooing & High-End Body Piercing',
          button1Text: 'VIEW OUR JEWELRY',
          button2Text: 'BOOK NOW',
          promotionTitle: 'Special Offer',
          promotionText: 'Book your consultation today and receive 10% off your first tattoo or piercing service.',
          promotionImage: 'https://picsum.photos/id/2/1920/1080',
          services: SERVICES,
          footerDescription: 'Premium custom tattooing and professional body piercing in the heart of the city. Where art meets skin.',
          footerHours: ['Tue - Sat: 11:00 AM - 8:00 PM', 'Sun - Mon: Appointment Only'],
          footerInstagramUrl: 'https://www.instagram.com/anthempiercingandtattoo?igsh=czg0dmJybXJ5bDJ6',
          footerFacebookUrl: 'https://www.facebook.com/AnthemTats/',
          footerAddress: '640 N Main St Suite 231, North Salt Lake, UT 84054',
          footerMapUrl: 'https://maps.app.goo.gl/kt9J9kKnSjssUYKh7',
          footerPhone: '(801) 247-5896',
          footerEmail: 'booking@anthemtattoo.com'
        };
      }
    }
    return {
      heroImage: 'https://picsum.photos/id/1/1920/1080',
      heroTitle: 'ELEVATE YOUR AESTHETIC',
      heroSubtitle: 'Premium Custom Tattooing & High-End Body Piercing',
      button1Text: 'VIEW OUR JEWELRY',
      button2Text: 'BOOK NOW',
      promotionTitle: 'Special Offer',
      promotionText: 'Book your consultation today and receive 10% off your first tattoo or piercing service.',
      promotionImage: 'https://picsum.photos/id/2/1920/1080',
      services: SERVICES,
      footerDescription: 'Premium custom tattooing and professional body piercing in the heart of the city. Where art meets skin.',
      footerHours: ['Tue - Sat: 11:00 AM - 8:00 PM', 'Sun - Mon: Appointment Only'],
      footerInstagramUrl: 'https://www.instagram.com/anthempiercingandtattoo?igsh=czg0dmJybXJ5bDJ6',
      footerFacebookUrl: 'https://www.facebook.com/AnthemTats/',
      footerAddress: '640 N Main St Suite 231, North Salt Lake, UT 84054',
      footerMapUrl: 'https://maps.app.goo.gl/kt9J9kKnSjssUYKh7',
      footerPhone: '(801) 247-5896',
      footerEmail: 'booking@anthemtattoo.com'
    };
  });

  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [jewelryFilter, setJewelryFilter] = useState<'all' | JewelryTag>('all');
  
  const [user, setUser] = useState<User | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('artists', JSON.stringify(artists));
  }, [artists]);

  useEffect(() => {
    localStorage.setItem('jewelry_items', JSON.stringify(jewelryItems));
  }, [jewelryItems]);

  useEffect(() => {
    localStorage.setItem('homepage_content', JSON.stringify(homepageContent));
  }, [homepageContent]);

  const handleAddItem = (item: Artist) => {
    const normalizedItem = { ...item, specialty: normalizeSpecialties(item.specialty) };
    setArtists(prev => [normalizedItem, ...prev]);
  };

  const handleRemoveItem = (id: string) => {
    setArtists(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateArtist = (artist: Artist) => {
    const normalizedArtist = { ...artist, specialty: normalizeSpecialties(artist.specialty) };
    setArtists(prev => prev.map(a => a.id === artist.id ? normalizedArtist : a));
  };

  const handleAddJewelryItem = (item: JewelryItem) => {
    const normalized = { ...item, tag: item.tag ?? 'piercing' };
    setJewelryItems(prev => [normalized, ...prev]);
  };

  const handleRemoveJewelryItem = (id: string) => {
    setJewelryItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateJewelryItem = (item: JewelryItem) => {
    const normalized = { ...item, tag: item.tag ?? 'piercing' };
    setJewelryItems(prev => prev.map(j => j.id === item.id ? normalized : j));
  };

  const handleUpdateHomepage = (content: HomepageContent) => {
    setHomepageContent(content);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stored bcrypt hash of the actual password
    const validPasswordHash = '$2y$10$62kCWRMB/yl6Yex5KOzm9OnkjrqihPmcmcZi3eW3ZX5879Go/Hli6';
    
    // Compare the input password with the stored hash
    const isValid = bcrypt.compareSync(passwordInput, validPasswordHash);
    
    if (isValid) {
      setUser({ username: 'Admin', isAdmin: true });
      setView(ViewState.ADMIN);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.HOME);
  };

  const NavLink = ({ label, targetView }: { label: string; targetView: ViewState }) => (
    <button
      onClick={() => {
        setView(targetView);
        setMobileMenuOpen(false);
      }}
      className={`text-lg md:text-sm font-bold tracking-widest uppercase hover:text-ink-gold transition-colors ${
        view === targetView ? 'text-ink-gold' : 'text-gray-400'
      }`}
    >
      {label}
    </button>
  );

  // Safety check: ensure homepageContent has all required fields
  const safeHomepageContent: HomepageContent = {
    heroImage: homepageContent?.heroImage || 'https://picsum.photos/id/1/1920/1080',
    heroTitle: homepageContent?.heroTitle || 'ELEVATE YOUR AESTHETIC',
    heroSubtitle: homepageContent?.heroSubtitle || 'Premium Custom Tattooing & High-End Body Piercing',
    button1Text: homepageContent?.button1Text || 'VIEW OUR JEWELRY',
    button2Text: homepageContent?.button2Text || 'BOOK NOW',
    promotionTitle: homepageContent?.promotionTitle || 'Special Offer',
    promotionText: homepageContent?.promotionText || 'Book your consultation today and receive 10% off your first tattoo or piercing service.',
    promotionImage: homepageContent?.promotionImage || 'https://picsum.photos/id/2/1920/1080',
    services: (homepageContent?.services && Array.isArray(homepageContent.services)) ? homepageContent.services : SERVICES
  };

  return (
    <div className="flex flex-col min-h-screen bg-ink-dark text-gray-200">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-ink-dark/95 backdrop-blur border-b border-ink-slate">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => { setView(ViewState.HOME); setMobileMenuOpen(false); }}
          >
            <img 
              src="/AnthemTatooAndPiercing/ANTHEM%20LOGO.png" 
              alt="Anthem Tattoo" 
              className="h-20 w-auto max-h-[80px] object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink label="Studio" targetView={ViewState.HOME} />
            <NavLink label="Our Team" targetView={ViewState.TEAM} />
            <NavLink label="Featured Jewelry" targetView={ViewState.JEWELRY} />
            {user?.isAdmin ? (
               <button onClick={() => setView(ViewState.ADMIN)} className="flex items-center gap-2 text-sm font-bold text-ink-gold border border-ink-gold px-4 py-2 rounded hover:bg-ink-gold hover:text-ink-dark transition-all">
                  <UserIcon size={16} /> Admin
               </button>
            ) : (
               <button onClick={() => setView(ViewState.LOGIN)} className="text-gray-600 hover:text-ink-gold transition-colors">
                 <Lock size={16} />
               </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-ink-gold"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-ink-dark border-b border-ink-slate p-4 flex flex-col space-y-4 items-center animate-in slide-in-from-top-2">
            <NavLink label="Studio" targetView={ViewState.HOME} />
            <NavLink label="Our Team" targetView={ViewState.TEAM} />
            <NavLink label="Featured Jewelry" targetView={ViewState.JEWELRY} />
            {user?.isAdmin ? (
               <button onClick={() => { setView(ViewState.ADMIN); setMobileMenuOpen(false); }} className="text-ink-gold font-bold">DASHBOARD</button>
            ) : (
               <button onClick={() => { setView(ViewState.LOGIN); setMobileMenuOpen(false); }} className="text-gray-500">ADMIN LOGIN</button>
            )}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* VIEW: HOME */}
        {view === ViewState.HOME && (
          <div className="animate-in fade-in duration-500">
            {/* Hero */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-ink-dark/70 z-10" />
              <img 
                src={safeHomepageContent.heroImage} 
                alt="Studio Background" 
                className="absolute inset-0 w-full h-full object-cover grayscale"
              />
              <div className="relative z-20 text-center px-4 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-serif text-ink-gold mb-6 tracking-wide">
                  {safeHomepageContent.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-light mb-8">
                  {safeHomepageContent.heroSubtitle}
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setView(ViewState.JEWELRY)}
                    className="px-8 py-3 bg-ink-gold text-ink-dark font-bold text-sm tracking-widest hover:bg-white transition-colors"
                  >
                    VIEW OUR JEWELRY
                  </button>
                  <button 
                    onClick={() => window.open('https://anthem.glossgenius.com/booking-flow', '_blank')}
                    className="px-8 py-3 border border-ink-gold text-ink-gold font-bold text-sm tracking-widest hover:bg-ink-gold hover:text-ink-dark transition-colors"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </section>

            {/* Promotion Section */}
            <section className="py-20 bg-ink-dark">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <h2 className="text-4xl md:text-5xl font-serif text-ink-gold mb-4">
                      {safeHomepageContent.promotionTitle}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-6">
                      {safeHomepageContent.promotionText}
                    </p>
                    <button 
                      onClick={() => window.open('https://anthem.glossgenius.com/booking-flow', '_blank')}
                      className="px-8 py-3 bg-ink-gold text-ink-dark font-bold text-sm tracking-widest hover:bg-white transition-colors"
                    >
                      BOOK NOW
                    </button>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-ink-gold">
                      <img 
                        src={safeHomepageContent.promotionImage} 
                        alt={safeHomepageContent.promotionTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="py-20 bg-ink-slate/10">
              <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {safeHomepageContent.services.map(service => (
                      <div key={service.id} className="bg-ink-slate/30 p-8 border border-ink-slate hover:border-ink-gold transition-colors group">
                        <div className="mb-4 text-ink-gold group-hover:scale-110 transition-transform duration-300">
                           {service.iconName === 'pen-tool' && <PenTool size={40} />}
                           {service.iconName === 'anchor' && <Anchor size={40} />}
                           {service.iconName === 'message-circle' && <UserIcon size={40} />}
                        </div>
                        <h3 className="text-2xl font-serif mb-2 text-gray-100">{service.title}</h3>
                        <p className="text-ink-gold font-bold mb-4">{service.priceRange}</p>
                        <p className="text-gray-400 leading-relaxed">{service.description}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* AI Generator Section - Removed temporarily */}
            {/* <section id="consultation" className="py-20 bg-ink-dark">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-serif text-gray-100 mb-2">Find Your Inspiration</h2>
                <div className="w-20 h-1 bg-ink-gold mx-auto mb-8"></div>
              </div>
            </section> */}
          </div>
        )}

        {/* VIEW: TEAM */}
        {view === ViewState.TEAM && (
          <>
            <div className="container mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-ink-gold mb-4">Our Team</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Meet our talented artists. Each brings their unique style and expertise to create unforgettable work.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {artists.map((artist) => (
                  <div 
                    key={artist.id} 
                    className="artist-card group relative overflow-hidden bg-ink-mud/20 rounded-lg cursor-pointer"
                    onClick={() => setSelectedArtist(artist)}
                  >
                    <div className="aspect-[3/4] overflow-hidden relative z-0">
                      <img 
                        src={artist.url} 
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-serif text-white">{artist.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {artist.specialty.map((specialty) => (
                          <span
                            key={specialty}
                            className="text-[10px] uppercase tracking-wider bg-ink-gold/15 text-ink-gold border border-ink-gold/40 px-2 py-0.5 rounded-full"
                          >
                            {formatSpecialties([specialty])}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="artist-card__overlay absolute inset-0 z-10 bg-ink-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-sm text-ink-gold font-bold uppercase tracking-wider">View profile</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artist Detail Modal */}
            {selectedArtist && (
              <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setSelectedArtist(null)}
              >
                <div 
                  className="bg-ink-dark border-2 border-ink-gold rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {/* Left Column - Artist Image */}
                    <div className="relative">
                      <button
                        onClick={() => setSelectedArtist(null)}
                        className="absolute -top-4 -right-4 z-10 bg-ink-gold text-ink-dark hover:bg-white p-2 rounded-full transition-colors"
                      >
                        <X size={24} />
                      </button>
                      
                      <div className="aspect-[3/4] overflow-hidden rounded-lg border border-ink-gold">
                        <img 
                          src={selectedArtist.url} 
                          alt={selectedArtist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Right Column - Artist Info */}
                    <div className="flex flex-col justify-center">
                      <span className="text-ink-gold text-sm font-bold uppercase tracking-wider">
                        {formatSpecialties(selectedArtist.specialty)} Artist
                      </span>
                      <h2 className="text-4xl font-serif text-white mt-2 mb-4">{selectedArtist.name}</h2>
                      <p className="text-gray-300 leading-relaxed">
                        Specialties: {formatSpecialties(selectedArtist.specialty)}
                      </p>
                      <p className="text-gray-300 leading-relaxed mt-3">{selectedArtist.bio}</p>
                    </div>
                  </div>

                  {/* Favorite Projects Section */}
                  <div className="px-8 pb-8">
                    <h3 className="text-2xl font-serif text-ink-gold mb-4">Favorite Projects</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {selectedArtist.favoriteProjects.map((project) => (
                        <div key={project.id} className="group relative overflow-hidden rounded-lg">
                          <div className="aspect-[3/4] overflow-hidden">
                            <img 
                              src={project.url} 
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <p className="text-white font-bold">{project.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* VIEW: JEWELRY */}
        {view === ViewState.JEWELRY && (
          <div className="container mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-ink-gold mb-4">Featured Jewelry</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Curated selection of premium body jewelry. Each piece combines style with quality craftsmanship.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { value: 'all' as const, label: 'All Jewelry' },
                { value: 'permanent' as const, label: 'Permanent Jewelry' },
                { value: 'piercing' as const, label: 'Piercing Jewelry' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setJewelryFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider border transition-colors ${
                    jewelryFilter === option.value
                      ? 'bg-ink-gold text-ink-dark border-ink-gold'
                      : 'text-ink-gold border-ink-gold/40 hover:border-ink-gold hover:bg-ink-gold/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {jewelryItems
                .filter(item => jewelryFilter === 'all' || item.tag === jewelryFilter)
                .slice()
                .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
                .map((item) => (
                <div key={item.id} className="group relative overflow-hidden bg-ink-mud/20 rounded-lg">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  {item.tag && (
                    <div className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-wider bg-ink-dark/80 text-ink-gold border border-ink-gold/40 px-2 py-1 rounded-full">
                      {item.tag === 'permanent' ? 'Permanent Jewelry' : 'Piercing Jewelry'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-serif text-white">{item.title}</h3>
                    {item.description && <p className="text-sm text-gray-300 mt-2 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: LOGIN */}
        {view === ViewState.LOGIN && (
           <div className="min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in">
             <div className="bg-ink-slate/20 p-8 rounded-lg border border-ink-slate max-w-md w-full backdrop-blur-sm">
                <h2 className="text-2xl font-serif text-center text-ink-gold mb-6">Staff Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Passcode</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-ink-dark border border-ink-mud rounded p-3 pr-12 text-white focus:border-ink-gold outline-none transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink-gold transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
                  <button 
                    type="submit"
                    className="w-full bg-ink-gold text-ink-dark font-bold py-3 rounded hover:bg-white transition-colors"
                  >
                    ENTER STUDIO
                  </button>
                </form>
             </div>
           </div>
        )}

        {/* VIEW: ADMIN */}
        {view === ViewState.ADMIN && user?.isAdmin && (
          <AdminDashboard 
            artists={artists}
            onAddArtist={handleAddItem}
            onRemoveArtist={handleRemoveItem}
            onUpdateArtist={handleUpdateArtist}
            jewelryItems={jewelryItems}
            onAddJewelryItem={handleAddJewelryItem}
            onRemoveJewelryItem={handleRemoveJewelryItem}
            onUpdateJewelryItem={handleUpdateJewelryItem}
            homepageContent={homepageContent}
            onUpdateHomepage={handleUpdateHomepage}
            onLogout={handleLogout}
          />
        )}
      </main>

      <Footer
        description={homepageContent.footerDescription}
        instagramUrl={homepageContent.footerInstagramUrl}
        facebookUrl={homepageContent.footerFacebookUrl}
        address={homepageContent.footerAddress}
        mapUrl={homepageContent.footerMapUrl}
        phone={homepageContent.footerPhone}
        email={homepageContent.footerEmail}
      />
    </div>
  );
};

export default App;
