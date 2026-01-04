// To run website use: npm run dev

import React, { useState, useEffect } from 'react';
import { Menu, X, Anchor, PenTool, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { ViewState, Artist, JewelryItem, User } from './types';
import { INITIAL_ARTISTS, SERVICES } from './constants';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [artists, setArtists] = useState<Artist[]>(() => {
    const saved = localStorage.getItem('artists');
    return saved ? JSON.parse(saved) : INITIAL_ARTISTS;
  });

  const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>(() => {
    const saved = localStorage.getItem('jewelry_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  
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

  const handleAddItem = (item: Artist) => {
    setArtists(prev => [item, ...prev]);
  };

  const handleRemoveItem = (id: string) => {
    setArtists(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateArtist = (artist: Artist) => {
    setArtists(prev => prev.map(a => a.id === artist.id ? artist : a));
  };

  const handleAddJewelryItem = (item: JewelryItem) => {
    setJewelryItems(prev => [item, ...prev]);
  };

  const handleRemoveJewelryItem = (id: string) => {
    setJewelryItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateJewelryItem = (item: JewelryItem) => {
    setJewelryItems(prev => prev.map(j => j.id === item.id ? item : j));
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

  return (
    <div className="flex flex-col min-h-screen bg-ink-dark text-gray-200">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-ink-dark/95 backdrop-blur border-b border-ink-slate">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="cursor-pointer"
            onClick={() => setView(ViewState.HOME)}
          >
            <img 
              src="/ANTHEM LOGO.png" 
              alt="Anthem Tattoo" 
              className="h-16 w-auto"
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
                src="https://picsum.photos/id/1/1920/1080" 
                alt="Studio Background" 
                className="absolute inset-0 w-full h-full object-cover grayscale"
              />
              <div className="relative z-20 text-center px-4 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-serif text-ink-gold mb-6 tracking-wide">
                  ELEVATE YOUR AESTHETIC
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 font-light mb-8">
                  Premium Custom Tattooing & High-End Body Piercing
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setView(ViewState.JEWELRY)}
                    className="px-8 py-3 bg-ink-gold text-ink-dark font-bold text-sm tracking-widest hover:bg-white transition-colors"
                  >
                    VIEW OUR JEWELRY
                  </button>
                  <button 
                    onClick={() => window.location.href='#consultation'}
                    className="px-8 py-3 border border-ink-gold text-ink-gold font-bold text-sm tracking-widest hover:bg-ink-gold hover:text-ink-dark transition-colors"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </section>

            {/* Services */}
            <section className="py-20 bg-ink-slate/10">
              <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SERVICES.map(service => (
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
                    className="group relative overflow-hidden bg-ink-mud/20 rounded-lg cursor-pointer"
                    onClick={() => setSelectedArtist(artist)}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={artist.url} 
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-ink-gold text-xs font-bold uppercase tracking-wider mb-1">{artist.specialty}</span>
                      <h3 className="text-xl font-serif text-white">{artist.name}</h3>
                      <p className="text-sm text-gray-300 mt-2">Click to view profile</p>
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
                      <span className="text-ink-gold text-sm font-bold uppercase tracking-wider">{selectedArtist.specialty} Artist</span>
                      <h2 className="text-4xl font-serif text-white mt-2 mb-4">{selectedArtist.name}</h2>
                      <p className="text-gray-300 leading-relaxed">{selectedArtist.bio}</p>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {jewelryItems.map((item) => (
                <div key={item.id} className="group relative overflow-hidden bg-ink-mud/20 rounded-lg">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  </div>
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
            onLogout={handleLogout}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;