import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, LogOut, Image as ImageIcon, Upload, Edit, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Artist, ArtistProject, JewelryItem, HomepageContent, Service, Specialty, JewelryTag } from '../types';
import { SPECIALTY_LABELS, SPECIALTY_OPTIONS } from '../constants';

interface AdminDashboardProps {
  artists: Artist[];
  onAddArtist: (artist: Artist) => void;
  onRemoveArtist: (id: string) => void;
  onUpdateArtist: (artist: Artist) => void;
  jewelryItems: JewelryItem[];
  onAddJewelryItem: (item: JewelryItem) => void;
  onRemoveJewelryItem: (id: string) => void;
  onUpdateJewelryItem: (item: JewelryItem) => void;
  homepageContent: HomepageContent;
  onUpdateHomepage: (content: HomepageContent) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  artists, 
  onAddArtist, 
  onRemoveArtist,
  onUpdateArtist,
  jewelryItems, 
  onAddJewelryItem, 
  onRemoveJewelryItem,
  onUpdateJewelryItem,
  homepageContent,
  onUpdateHomepage,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'homepage' | 'team' | 'jewelry'>('homepage');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSpecialties, setNewItemSpecialties] = useState<Specialty[]>(['tattoo']);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemJewelryTag, setNewItemJewelryTag] = useState<JewelryTag>('piercing');
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingJewelry, setEditingJewelry] = useState<JewelryItem | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [projectUrls, setProjectUrls] = useState<string[]>(['', '', '']);
  const [projectTitles, setProjectTitles] = useState<string[]>(['', '', '']);
  const [homepageEdit, setHomepageEdit] = useState<HomepageContent>(homepageContent);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [promotionExpanded, setPromotionExpanded] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [footerExpanded, setFooterExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);
  const projectFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const projectItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const [scrollToProjectIndex, setScrollToProjectIndex] = useState<number | null>(null);

  useEffect(() => {
    setHomepageEdit(homepageContent);
  }, [homepageContent]);

  const formatSpecialties = (specialties: Specialty[]) => (
    specialties.map(specialty => SPECIALTY_LABELS[specialty] ?? specialty).join(', ')
  );

  const toggleSpecialty = (specialty: Specialty) => {
    setNewItemSpecialties(prev => {
      if (prev.includes(specialty)) {
        if (prev.length === 1) return prev;
        return prev.filter(item => item !== specialty);
      }
      return [...prev, specialty];
    });
  };

  useEffect(() => {
    if (scrollToProjectIndex === null) return;
    const target = projectItemRefs.current[scrollToProjectIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setScrollToProjectIndex(null);
  }, [scrollToProjectIndex, projectUrls.length]);

  const readAndCompressImage = (
    file: File,
    options: { maxWidth: number; maxHeight: number; quality: number },
    onDone: (dataUrl: string) => void
  ) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') return;

      img.onload = () => {
        let { width, height } = img;
        const widthRatio = options.maxWidth / width;
        const heightRatio = options.maxHeight / height;
        const scale = Math.min(1, widthRatio, heightRatio);

        width = Math.floor(width * scale);
        height = Math.floor(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', options.quality);
        onDone(compressed);
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readAndCompressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 }, (dataUrl) => {
      setNewItemUrl(dataUrl);
    });
  };

  const handleProjectImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readAndCompressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 }, (dataUrl) => {
      setProjectUrls(prev => {
        const next = [...prev];
        next[index] = dataUrl;
        return next;
      });
    });
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readAndCompressImage(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.82 }, (dataUrl) => {
      setHomepageEdit(prev => ({ ...prev, heroImage: dataUrl }));
    });
  };

  const handleSaveHomepage = () => {
    const heroTooLarge = homepageEdit.heroImage?.startsWith('data:') && homepageEdit.heroImage.length > 1_500_000;
    const promoTooLarge = homepageEdit.promotionImage?.startsWith('data:') && homepageEdit.promotionImage.length > 1_500_000;
    if (heroTooLarge || promoTooLarge) {
      alert('One or more homepage images are very large and may not save on some devices. Please use a smaller image.');
      return;
    }
    onUpdateHomepage(homepageEdit);
    alert('Homepage updated successfully!');
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
  };

  const handleUpdateService = (service: Service) => {
    const updatedServices = homepageEdit.services.map(s => s.id === service.id ? service : s);
    setHomepageEdit({ ...homepageEdit, services: updatedServices });
    setEditingService(null);
  };

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: 'New Service',
      priceRange: '$0',
      description: 'Service description',
      iconName: 'pen-tool'
    };
    setHomepageEdit({ ...homepageEdit, services: [...homepageEdit.services, newService] });
  };

  const handleRemoveService = (id: string) => {
    const updatedServices = homepageEdit.services.filter(s => s.id !== id);
    setHomepageEdit({ ...homepageEdit, services: updatedServices });
  };

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setNewItemUrl(artist.url);
    setNewItemTitle(artist.name);
    setNewItemSpecialties(artist.specialty.length ? artist.specialty : ['tattoo']);
    setNewItemDesc(artist.bio || '');
    const projectCount = Math.max(artist.favoriteProjects.length, 3);
    setProjectUrls(
      Array.from({ length: projectCount }, (_, index) => (
        artist.favoriteProjects[index]?.url || ''
      ))
    );
    setProjectTitles(
      Array.from({ length: projectCount }, (_, index) => (
        artist.favoriteProjects[index]?.title || ''
      ))
    );
  };

  const handleEditJewelry = (item: JewelryItem) => {
    setEditingJewelry(item);
    setNewItemUrl(item.url);
    setNewItemTitle(item.title);
    setNewItemDesc(item.description || '');
    setNewItemJewelryTag(item.tag ?? 'piercing');
  };

  const handleCancelEdit = () => {
    setShowAddModal(false);
    setEditingArtist(null);
    setEditingJewelry(null);
    setNewItemUrl('');
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemSpecialties(['tattoo']);
    setNewItemJewelryTag('piercing');
    setProjectUrls(['', '', '']);
    setProjectTitles(['', '', '']);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    projectFileRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };

  const handleAddProjectField = () => {
    setProjectUrls(prev => {
      const next = [...prev, ''];
      setScrollToProjectIndex(next.length - 1);
      return next;
    });
    setProjectTitles(prev => [...prev, '']);
    projectFileRefs.current = [...projectFileRefs.current, null];
    projectItemRefs.current = [...projectItemRefs.current, null];
  };

  const handleRemoveProjectField = (index: number) => {
    if (projectUrls.length <= 1) return;
    setProjectUrls(prev => prev.filter((_, i) => i !== index));
    setProjectTitles(prev => prev.filter((_, i) => i !== index));
    projectFileRefs.current = projectFileRefs.current.filter((_, i) => i !== index);
    projectItemRefs.current = projectItemRefs.current.filter((_, i) => i !== index);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle) return;
    
    // When adding new, require photo
    if (!newItemUrl) return;

    if (activeTab === 'team') {
      const normalizedSpecialties = newItemSpecialties.length ? newItemSpecialties : ['tattoo'];
      const favoriteProjects: ArtistProject[] = projectUrls
        .map((url, idx) => ({
          id: `proj-${Date.now()}-${idx}`,
          url: url,
          title: projectTitles[idx] || `Project ${idx + 1}`
        }))
        .filter(p => p.url);

      // Add new artist
      const newArtist: Artist = {
        id: Date.now().toString(),
        url: newItemUrl,
        name: newItemTitle,
        specialty: normalizedSpecialties,
        bio: newItemDesc,
        favoriteProjects
      };
      onAddArtist(newArtist);
    } else {
      // Add new jewelry
      const newItem: JewelryItem = {
        id: Date.now().toString(),
        url: newItemUrl,
        title: newItemTitle,
        description: newItemDesc,
        tag: newItemJewelryTag
      };
      onAddJewelryItem(newItem);
    }
    
    // Reset form and close modal
    setShowAddModal(false);
    setNewItemUrl('');
    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemSpecialties(['tattoo']);
    setNewItemJewelryTag('piercing');
    setProjectUrls(['', '', '']);
    setProjectTitles(['', '', '']);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    projectFileRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle) return;

    if (activeTab === 'team' && editingArtist) {
      const normalizedSpecialties = newItemSpecialties.length ? newItemSpecialties : ['tattoo'];
      const favoriteProjects: ArtistProject[] = projectUrls
        .map((url, idx) => ({
          id: editingArtist.favoriteProjects[idx]?.id || `proj-${Date.now()}-${idx}`,
          url: url,
          title: projectTitles[idx] || `Project ${idx + 1}`
        }))
        .filter(p => p.url);

      const updatedArtist: Artist = {
        ...editingArtist,
        url: newItemUrl || editingArtist.url,
        name: newItemTitle,
        specialty: normalizedSpecialties,
        bio: newItemDesc,
        favoriteProjects
      };
      onUpdateArtist(updatedArtist);
    } else if (editingJewelry) {
      const updatedItem: JewelryItem = {
        ...editingJewelry,
        url: newItemUrl || editingJewelry.url,
        title: newItemTitle,
        description: newItemDesc,
        tag: newItemJewelryTag
      };
      onUpdateJewelryItem(updatedItem);
    }
    
    handleCancelEdit();
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-ink-slate pb-4">
        <h2 className="text-3xl font-serif text-ink-gold">Admin Dashboard</h2>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-ink-slate">
        <button
          onClick={() => {
            setActiveTab('homepage');
            handleCancelEdit();
          }}
          className={`pb-3 px-4 font-bold transition-colors ${
            activeTab === 'homepage'
              ? 'text-ink-gold border-b-2 border-ink-gold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Homepage
        </button>
        <button
          onClick={() => {
            setActiveTab('team');
            handleCancelEdit();
          }}
          className={`pb-3 px-4 font-bold transition-colors ${
            activeTab === 'team'
              ? 'text-ink-gold border-b-2 border-ink-gold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Our Team ({artists.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('jewelry');
            handleCancelEdit();
          }}
          className={`pb-3 px-4 font-bold transition-colors ${
            activeTab === 'jewelry'
              ? 'text-ink-gold border-b-2 border-ink-gold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Featured Jewelry ({jewelryItems.length})
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'homepage' ? (
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-ink-dark border border-ink-mud rounded-lg p-6">
            <button
              onClick={() => setHeroExpanded(!heroExpanded)}
              className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
            >
              <h3 className="text-xl font-bold text-gray-200">Hero Section</h3>
              {heroExpanded ? (
                <ChevronUp className="text-ink-gold" size={24} />
              ) : (
                <ChevronDown className="text-ink-gold" size={24} />
              )}
            </button>
            {heroExpanded && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Hero Image URL</label>
                  <div className="flex gap-4">
                    <input
                      ref={heroImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-gray-300 focus:border-ink-gold outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or enter image URL"
                      className="flex-1 bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                      value={homepageEdit.heroImage}
                      onChange={(e) => setHomepageEdit({ ...homepageEdit, heroImage: e.target.value })}
                    />
                  </div>
                  {homepageEdit.heroImage && (
                    <img src={homepageEdit.heroImage} alt="Hero preview" className="mt-2 w-full max-w-md h-48 object-cover rounded border border-ink-gold" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Hero Title</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.heroTitle}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, heroTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.heroSubtitle}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, heroSubtitle: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Promotion Section */}
          <div className="bg-ink-dark border border-ink-mud rounded-lg p-6">
            <button
              onClick={() => setPromotionExpanded(!promotionExpanded)}
              className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
            >
              <h3 className="text-xl font-bold text-gray-200">Promotion Section</h3>
              {promotionExpanded ? (
                <ChevronUp className="text-ink-gold" size={24} />
              ) : (
                <ChevronDown className="text-ink-gold" size={24} />
              )}
            </button>
            {promotionExpanded && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Promotion Image URL</label>
                  <div className="flex gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        readAndCompressImage(file, { maxWidth: 1600, maxHeight: 900, quality: 0.82 }, (dataUrl) => {
                          setHomepageEdit(prev => ({ ...prev, promotionImage: dataUrl }));
                        });
                      }}
                      className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-gray-300 focus:border-ink-gold outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or enter image URL"
                      className="flex-1 bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                      value={homepageEdit.promotionImage}
                      onChange={(e) => setHomepageEdit({ ...homepageEdit, promotionImage: e.target.value })}
                    />
                  </div>
                  {homepageEdit.promotionImage && (
                    <img src={homepageEdit.promotionImage} alt="Promotion preview" className="mt-2 w-full max-w-md h-48 object-cover rounded border border-ink-gold" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Promotion Title</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.promotionTitle}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, promotionTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Promotion Text</label>
                  <textarea
                    rows={3}
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.promotionText}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, promotionText: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Services Section */}
          <div className="bg-ink-dark border border-ink-mud rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setServicesExpanded(!servicesExpanded)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <h3 className="text-xl font-bold text-gray-200">Services</h3>
                {servicesExpanded ? (
                  <ChevronUp className="text-ink-gold" size={24} />
                ) : (
                  <ChevronDown className="text-ink-gold" size={24} />
                )}
              </button>
            </div>
            {servicesExpanded && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-end">
                  <button
                    onClick={handleAddService}
                    className="flex items-center gap-2 bg-ink-gold text-ink-dark font-bold px-4 py-2 rounded hover:bg-white transition-colors"
                  >
                    <Plus size={18} /> Add Service
                  </button>
                </div>
                {homepageEdit.services.map((service) => (
                <div key={service.id} className="bg-ink-dark/50 border border-ink-mud rounded p-4">
                  {editingService?.id === service.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Title</label>
                          <input
                            type="text"
                            className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white text-sm focus:border-ink-gold outline-none"
                            value={editingService.title}
                            onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Price Range</label>
                          <input
                            type="text"
                            className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white text-sm focus:border-ink-gold outline-none"
                            value={editingService.priceRange}
                            onChange={(e) => setEditingService({ ...editingService, priceRange: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <textarea
                          rows={2}
                          className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white text-sm focus:border-ink-gold outline-none"
                          value={editingService.description}
                          onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateService(editingService)}
                          className="flex-1 bg-ink-gold text-ink-dark font-bold py-2 rounded text-sm hover:bg-white transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="px-4 bg-gray-600 text-white font-bold py-2 rounded text-sm hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-ink-gold">{service.title}</h4>
                        <p className="text-sm text-gray-400">{service.priceRange}</p>
                        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-gray-500 hover:text-ink-gold transition-colors p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveService(service.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="bg-ink-dark border border-ink-mud rounded-lg p-6">
            <button
              onClick={() => setFooterExpanded(!footerExpanded)}
              className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
            >
              <h3 className="text-xl font-bold text-gray-200">Footer</h3>
              {footerExpanded ? (
                <ChevronUp className="text-ink-gold" size={24} />
              ) : (
                <ChevronDown className="text-ink-gold" size={24} />
              )}
            </button>
            {footerExpanded && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Footer Description</label>
                  <textarea
                    rows={3}
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.footerDescription}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, footerDescription: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Footer Address</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.footerAddress}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, footerAddress: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Google Maps URL</label>
                  <input
                    type="text"
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={homepageEdit.footerMapUrl}
                    onChange={(e) => setHomepageEdit({ ...homepageEdit, footerMapUrl: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                      value={homepageEdit.footerPhone}
                      onChange={(e) => setHomepageEdit({ ...homepageEdit, footerPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input
                      type="text"
                      className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                      value={homepageEdit.footerEmail}
                      onChange={(e) => setHomepageEdit({ ...homepageEdit, footerEmail: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-1">Tip: include the @ symbol so mail links work correctly.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Instagram URL</label>
                    <input
                      type="text"
                      className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                      value={homepageEdit.footerInstagramUrl}
                      onChange={(e) => setHomepageEdit({ ...homepageEdit, footerInstagramUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Facebook URL</label>
                    <input
                      type="text"
                      className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                      value={homepageEdit.footerFacebookUrl}
                      onChange={(e) => setHomepageEdit({ ...homepageEdit, footerFacebookUrl: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveHomepage}
              className="bg-ink-gold text-ink-dark font-bold px-8 py-3 rounded hover:bg-white transition-colors"
            >
              Save Homepage Changes
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-200 flex items-center gap-2">
              <ImageIcon className="text-ink-gold" /> Current {activeTab === 'team' ? 'Team' : 'Jewelry'} ({activeTab === 'team' ? artists.length : jewelryItems.length})
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-ink-gold text-ink-dark font-bold px-6 py-3 rounded hover:bg-white transition-colors"
            >
              <Plus size={20} /> Add New {activeTab === 'team' ? 'Artist' : 'Jewelry'}
            </button>
          </div>

      {activeTab === 'team' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {artists.map((artist) => (
                  <div key={artist.id} className="group relative bg-ink-dark border border-ink-mud rounded overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={artist.url}
                        alt={artist.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-ink-gold truncate">{artist.name}</h4>
                          <span className="text-xs text-gray-500 uppercase tracking-wider">
                            {formatSpecialties(artist.specialty)}
                          </span>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{artist.bio}</p>
                          <p className="text-xs text-gray-600 mt-1">{artist.favoriteProjects.length} projects</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEditArtist(artist)}
                            className="text-gray-500 hover:text-ink-gold transition-colors p-1"
                            title="Edit Artist"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onRemoveArtist(artist.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
                            title="Delete Artist"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {artists.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500 border-2 border-dashed border-ink-mud rounded-lg">
                    No team members yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jewelryItems.map((item) => (
                  <div key={item.id} className="group relative bg-ink-dark border border-ink-mud rounded overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-ink-gold truncate">{item.title}</h4>
                          {item.tag && (
                            <span className="text-[10px] uppercase tracking-wider text-ink-gold/80">
                              {item.tag === 'permanent' ? 'Permanent Jewelry' : 'Piercing Jewelry'}
                            </span>
                          )}
                          {item.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEditJewelry(item)}
                            className="text-gray-500 hover:text-ink-gold transition-colors p-1"
                            title="Edit Item"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => onRemoveJewelryItem(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors p-1"
                            title="Delete Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {jewelryItems.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500 border-2 border-dashed border-ink-mud rounded-lg">
                    No jewelry items yet.
                  </div>
                )}
              </div>
            )}
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCancelEdit}
        >
          <div 
            className="bg-ink-dark border-2 border-ink-gold rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-ink-dark border-b border-ink-gold p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-serif text-ink-gold flex items-center gap-2">
                <Plus size={24} /> Add New {activeTab === 'team' ? 'Artist' : 'Jewelry'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-ink-gold hover:text-white p-2 rounded-full hover:bg-ink-slate transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'team' ? 'Artist Photo' : 'Upload Image'}
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-gray-300 focus:border-ink-gold outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer"
                  />
                </div>
                {newItemUrl && (
                  <div className="mt-2 relative group w-24 h-24">
                    <img src={newItemUrl} alt="Preview" className="w-full h-full object-cover rounded border border-ink-gold" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      Preview
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'team' ? 'Artist Name' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'team' ? 'Full name' : 'Title of piece'}
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
              </div>

              {activeTab === 'jewelry' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Jewelry Tag</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="jewelryTag"
                        className="h-4 w-4 accent-ink-gold"
                        checked={newItemJewelryTag === 'permanent'}
                        onChange={() => setNewItemJewelryTag('permanent')}
                      />
                      <span>Permanent Jewelry</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="jewelryTag"
                        className="h-4 w-4 accent-ink-gold"
                        checked={newItemJewelryTag === 'piercing'}
                        onChange={() => setNewItemJewelryTag('piercing')}
                      />
                      <span>Piercing Jewelry</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Choose one tag for filtering.</p>
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Specialties</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SPECIALTY_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-ink-gold"
                          checked={newItemSpecialties.includes(option.value)}
                          onChange={() => toggleSpecialty(option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select at least 1 specialty.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'team' ? 'Bio' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  placeholder={activeTab === 'team' ? 'Artist bio and background...' : 'Details about the work...'}
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                />
              </div>

              {activeTab === 'team' && (
                <div className="border-t border-ink-mud pt-4 mt-4">
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Favorite Projects
                  </label>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-gray-500">Start with 3, add or remove as needed.</p>
                    <button
                      type="button"
                      onClick={handleAddProjectField}
                      className="flex items-center gap-2 bg-ink-gold text-ink-dark font-bold px-3 py-1.5 rounded hover:bg-white transition-colors text-xs"
                    >
                      <Plus size={14} /> Add Project
                    </button>
                  </div>
                  {projectUrls.length === 0 && (
                    <p className="text-xs text-gray-500 mb-3">No projects yet.</p>
                  )}
                  {projectUrls.map((_, index) => (
                    <div
                      key={index}
                      ref={(el) => projectItemRefs.current[index] = el}
                      className="mb-4 p-3 bg-ink-dark/50 rounded border border-ink-mud/50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500">Project {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveProjectField(index)}
                          className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                          disabled={projectUrls.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        ref={(el) => projectFileRefs.current[index] = el}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProjectImageChange(index, e)}
                        className="w-full bg-ink-dark border border-ink-mud rounded p-1 text-gray-300 focus:border-ink-gold outline-none file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer text-xs mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Project title"
                        className="w-full bg-ink-dark border border-ink-mud rounded p-1.5 text-white text-sm focus:border-ink-gold outline-none"
                        value={projectTitles[index]}
                        onChange={(e) => {
                          const newTitles = [...projectTitles];
                          newTitles[index] = e.target.value;
                          setProjectTitles(newTitles);
                        }}
                      />
                      {projectUrls[index] && (
                        <img src={projectUrls[index]} alt={`Project ${index + 1}`} className="mt-2 w-16 h-16 object-cover rounded border border-ink-gold" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-ink-gold text-ink-dark font-bold py-3 rounded hover:bg-white transition-colors"
                >
                  Add {activeTab === 'team' ? 'Artist' : 'Jewelry'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 bg-gray-600 text-white font-bold py-3 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {(editingArtist || editingJewelry) && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCancelEdit}
        >
          <div 
            className="bg-ink-dark border-2 border-ink-gold rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-ink-dark border-b border-ink-gold p-6 flex justify-between items-center z-10">
              <h3 className="text-2xl font-serif text-ink-gold flex items-center gap-2">
                <Edit size={24} /> Edit {activeTab === 'team' ? 'Artist' : 'Jewelry'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-ink-gold hover:text-white p-2 rounded-full hover:bg-ink-slate transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'team' ? 'Artist Photo' : 'Upload Image'}
                  <span className="text-xs text-gray-500 ml-2">(Leave blank to keep current photo)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-gray-300 focus:border-ink-gold outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer"
                  />
                </div>
                {newItemUrl && (
                  <div className="mt-2 relative group w-24 h-24">
                    <img src={newItemUrl} alt="Preview" className="w-full h-full object-cover rounded border border-ink-gold" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      Preview
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'team' ? 'Artist Name' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === 'team' ? 'Full name' : 'Title of piece'}
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
              </div>

              {activeTab === 'jewelry' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Jewelry Tag</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="jewelryTagEdit"
                        className="h-4 w-4 accent-ink-gold"
                        checked={newItemJewelryTag === 'permanent'}
                        onChange={() => setNewItemJewelryTag('permanent')}
                      />
                      <span>Permanent Jewelry</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="radio"
                        name="jewelryTagEdit"
                        className="h-4 w-4 accent-ink-gold"
                        checked={newItemJewelryTag === 'piercing'}
                        onChange={() => setNewItemJewelryTag('piercing')}
                      />
                      <span>Piercing Jewelry</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Choose one tag for filtering.</p>
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Specialties</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SPECIALTY_OPTIONS.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-ink-gold"
                          checked={newItemSpecialties.includes(option.value)}
                          onChange={() => toggleSpecialty(option.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select at least 1 specialty.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {activeTab === 'team' ? 'Bio' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  placeholder={activeTab === 'team' ? 'Artist bio and background...' : 'Details about the work...'}
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                />
              </div>

              {activeTab === 'team' && editingArtist && (
                <div className="border-t border-ink-mud pt-4 mt-4">
                  <label className="block text-sm font-bold text-gray-300 mb-3">
                    Favorite Projects
                  </label>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-gray-500">Add, remove, or update projects.</p>
                    <button
                      type="button"
                      onClick={handleAddProjectField}
                      className="flex items-center gap-2 bg-ink-gold text-ink-dark font-bold px-3 py-1.5 rounded hover:bg-white transition-colors text-xs"
                    >
                      <Plus size={14} /> Add Project
                    </button>
                  </div>
                  {projectUrls.length === 0 && (
                    <p className="text-xs text-gray-500 mb-3">No projects yet.</p>
                  )}
                  {projectUrls.map((_, index) => (
                    <div
                      key={index}
                      ref={(el) => projectItemRefs.current[index] = el}
                      className="mb-4 p-3 bg-ink-dark/50 rounded border border-ink-mud/50"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-500">Project {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveProjectField(index)}
                          className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                          disabled={projectUrls.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProjectImageChange(index, e)}
                        className="w-full bg-ink-dark border border-ink-mud rounded p-1 text-gray-300 focus:border-ink-gold outline-none file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer text-xs mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Project title"
                        className="w-full bg-ink-dark border border-ink-mud rounded p-1.5 text-white text-sm focus:border-ink-gold outline-none"
                        value={projectTitles[index]}
                        onChange={(e) => {
                          const newTitles = [...projectTitles];
                          newTitles[index] = e.target.value;
                          setProjectTitles(newTitles);
                        }}
                      />
                      {projectUrls[index] && (
                        <div className="mt-2 relative">
                          <img src={projectUrls[index]} alt={`Project ${index + 1}`} className="w-16 h-16 object-cover rounded border border-ink-gold" />
                          <p className="text-xs text-gray-500 mt-1">Current image</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-ink-gold text-ink-dark font-bold py-3 rounded hover:bg-white transition-colors"
                >
                  Update {activeTab === 'team' ? 'Artist' : 'Jewelry'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 bg-gray-600 text-white font-bold py-3 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
