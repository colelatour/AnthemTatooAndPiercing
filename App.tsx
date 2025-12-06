import React, { useState, useEffect } from 'react';
import { Menu, X, Anchor, PenTool, Lock, User as UserIcon } from 'lucide-react';
import { ViewState, PortfolioItem, User } from './types';
import { INITIAL_PORTFOLIO, SERVICES } from './constants';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import GeminiConsultant from './components/GeminiConsultant';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('portfolio_items');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('portfolio_items', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (item: PortfolioItem) => {
    setItems(prev => [item, ...prev]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded mock authentication
    if (passwordInput === 'admin123') {
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
            className="text-2xl font-serif font-bold text-ink-gold cursor-pointer tracking-tighter"
            onClick={() => setView(ViewState.HOME)}
          >
            ANTHEM TATTOO
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink label="Studio" targetView={ViewState.HOME} />
            <NavLink label="Portfolio" targetView={ViewState.PORTFOLIO} />
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
            <NavLink label="Portfolio" targetView={ViewState.PORTFOLIO} />
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
                    onClick={() => setView(ViewState.PORTFOLIO)}
                    className="px-8 py-3 bg-ink-gold text-ink-dark font-bold text-sm tracking-widest hover:bg-white transition-colors"
                  >
                    VIEW WORK
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

            {/* AI Generator Section */}
            <section id="consultation" className="py-20 bg-ink-dark">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-serif text-gray-100 mb-2">Find Your Inspiration</h2>
                <div className="w-20 h-1 bg-ink-gold mx-auto mb-8"></div>
                <GeminiConsultant />
              </div>
            </section>
          </div>
        )}

        {/* VIEW: PORTFOLIO */}
        {view === ViewState.PORTFOLIO && (
          <div className="container mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif text-ink-gold mb-4">Selected Works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                A collection of our finest pieces in ink and steel. Each project is a unique collaboration between client and artist.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group relative overflow-hidden bg-ink-mud/20 rounded-lg">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-ink-gold text-xs font-bold uppercase tracking-wider mb-1">{item.category}</span>
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
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-ink-dark border border-ink-mud rounded p-3 text-white focus:border-ink-gold outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
                  <button 
                    type="submit"
                    className="w-full bg-ink-gold text-ink-dark font-bold py-3 rounded hover:bg-white transition-colors"
                  >
                    ENTER STUDIO
                  </button>
                  <p className="text-xs text-center text-gray-600 mt-4">Hint: admin123</p>
                </form>
             </div>
           </div>
        )}

        {/* VIEW: ADMIN */}
        {view === ViewState.ADMIN && user?.isAdmin && (
          <AdminDashboard 
            items={items}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onLogout={handleLogout}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;