import React, { useState, useRef } from 'react';
import { Trash2, Plus, LogOut, Image as ImageIcon, Upload } from 'lucide-react';
import { PortfolioItem } from '../types';

interface AdminDashboardProps {
  items: PortfolioItem[];
  onAddItem: (item: PortfolioItem) => void;
  onRemoveItem: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ items, onAddItem, onRemoveItem, onLogout }) => {
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'tattoo' | 'piercing'>('tattoo');
  const [newItemDesc, setNewItemDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemUrl || !newItemTitle) return;

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      url: newItemUrl,
      title: newItemTitle,
      category: newItemCategory,
      description: newItemDesc
    };

    onAddItem(newItem);
    
    // Reset form
    setNewItemUrl('');
    setNewItemTitle('');
    setNewItemDesc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add New Item Form */}
        <div className="lg:col-span-1">
          <div className="bg-ink-slate/20 p-6 rounded-lg border border-ink-slate sticky top-4">
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Plus className="text-ink-gold" /> Add New Work
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Upload Image</label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-gray-300 focus:border-ink-gold outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ink-gold file:text-ink-dark hover:file:bg-white transition-colors cursor-pointer"
                  />
                  {!newItemUrl && (
                    <div className="absolute top-2 right-2 text-gray-500 pointer-events-none">
                      <Upload size={16} />
                    </div>
                  )}
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
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Title of piece"
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as 'tattoo' | 'piercing')}
                >
                  <option value="tattoo">Tattoo</option>
                  <option value="piercing">Piercing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details about the work..."
                  className="w-full bg-ink-dark border border-ink-mud rounded p-2 text-white focus:border-ink-gold outline-none"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ink-gold text-ink-dark font-bold py-2 rounded hover:bg-white transition-colors"
              >
                Add to Portfolio
              </button>
            </form>
          </div>
        </div>

        {/* List of Items */}
        <div className="lg:col-span-2">
           <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
              <ImageIcon className="text-ink-gold" /> Current Portfolio ({items.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item) => (
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
                      <div>
                        <h4 className="font-bold text-ink-gold truncate">{item.title}</h4>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                        title="Delete Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500 border-2 border-dashed border-ink-mud rounded-lg">
                  No items in portfolio yet.
                </div>
              )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;