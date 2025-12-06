import React, { useState, useRef } from 'react';
import { Trash2, Plus, LogOut, Image as ImageIcon, Upload, Edit, X } from 'lucide-react';
import { Artist, ArtistProject, JewelryItem } from '../types';

interface AdminDashboardProps {
  artists: Artist[];
  onAddArtist: (artist: Artist) => void;
  onRemoveArtist: (id: string) => void;
  onUpdateArtist: (artist: Artist) => void;
  jewelryItems: JewelryItem[];
  onAddJewelryItem: (item: JewelryItem) => void;
  onRemoveJewelryItem: (id: string) => void;
  onUpdateJewelryItem: (item: JewelryItem) => void;
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
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'jewelry'>('team');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'tattoo' | 'piercing'>('tattoo');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingJewelry, setEditingJewelry] = useState<JewelryItem | null>(null);
  const [projectUrls, setProjectUrls] = useState<string[]>(['', '', '']);
  const [projectTitles, setProjectTitles] = useState<string[]>(['', '', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUrls = [...projectUrls];
        newUrls[index] = reader.result as string;
        setProjectUrls(newUrls);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setNewItemUrl(artist.url);
    setNewItemTitle(artist.name);
    setNewItemCategory(artist.specialty);
    setNewItemDesc(artist.bio || '');
    setProjectUrls([
      artist.favoriteProjects[0]?.url || '',
      artist.favoriteProjects[1]?.url || '',
      artist.favoriteProjects[2]?.url || ''
    ]);
    setProjectTitles([
      artist.favoriteProjects[0]?.title || '',
      artist.favoriteProjects[1]?.title || '',
      artist.favoriteProjects[2]?.title || ''
    ]);
  };

  const handleEditJewelry = (item: JewelryItem) => {
    setEditingJewelry(item);
    setNewItemUrl(item.url);
    setNewItemTitle(item.title);
    setNewItemDesc(item.description || '');
  };

  const handleCancelEdit = () => {
    setShowAddModal(false);
    setEditingArtist(null);
    setEditingJewelry(null);
    setNewItemUrl('');
    setNewItemTitle('');
    setNewItemDesc('');
    setProjectUrls(['', '', '']);
    setProjectTitles(['', '', '']);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    projectFileRefs.current.forEach(ref => {
      if (ref) ref.value = '';
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle) return;
    
    // When adding new, require photo
    if (!newItemUrl) return;

    if (activeTab === 'team') {
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
        specialty: newItemCategory,
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
        description: newItemDesc
      };
      onAddJewelryItem(newItem);
    }
    
    // Reset form and close modal
    setShowAddModal(false);
    setNewItemUrl('');
    setNewItemTitle('');
    setNewItemDesc('');
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
      const favoriteProjects: ArtistProject[] = projectUrls
        .map((url, idx) => ({
          id: editingArtist.favoriteProjects[idx]?.id || `proj-${Date.now()}-${idx}`,
          url: url || (editingArtist.favoriteProjects[idx]?.url || ''),
          title: projectTitles[idx] || editingArtist.favoriteProjects[idx]?.title || `Project ${idx + 1}`
        }))
        .filter(p => p.url);

      const updatedArtist: Artist = {
        ...editingArtist,
        url: newItemUrl || editingArtist.url,
        name: newItemTitle,
        specialty: newItemCategory,
        bio: newItemDesc,
        favoriteProjects
      };
      onUpdateArtist(updatedArtist);
    } else if (editingJewelry) {
      const updatedItem: JewelryItem = {
        ...editingJewelry,
        url: newItemUrl || editingJewelry.url,
        title: newItemTitle,
        description: newItemDesc
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
                          <span className="text-xs text-gray-500 uppercase tracking-wider">{artist.specialty}</span>
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

              {activeTab === 'team' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Specialty</label>
                  <select
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as 'tattoo' | 'piercing')}
                  >
                    <option value="tattoo">Tattoo</option>
                    <option value="piercing">Piercing</option>
                  </select>
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
                    Favorite Projects (Up to 3)
                  </label>
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="mb-4 p-3 bg-ink-dark/50 rounded border border-ink-mud/50">
                      <p className="text-xs text-gray-500 mb-2">Project {index + 1}</p>
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

              {activeTab === 'team' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Specialty</label>
                  <select
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as 'tattoo' | 'piercing')}
                  >
                    <option value="tattoo">Tattoo</option>
                    <option value="piercing">Piercing</option>
                  </select>
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
                    Favorite Projects (Up to 3)
                    <span className="text-xs text-gray-500 ml-2 font-normal">(Leave blank to keep existing)</span>
                  </label>
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="mb-4 p-3 bg-ink-dark/50 rounded border border-ink-mud/50">
                      <p className="text-xs text-gray-500 mb-2">Project {index + 1}</p>
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