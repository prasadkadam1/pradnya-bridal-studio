import React, { useState } from 'react';
import { usePortfolio, useAddPortfolio, useDeletePortfolio } from '../../hooks/useFirestore';
import { useStorage } from '../../hooks/useStorage';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { ImagePlus, Trash2, X } from 'lucide-react';
import type { PortfolioCategory } from '../../types/studio';

export const ManagePortfolio: React.FC = () => {
  const { data: portfolioItems, isLoading } = usePortfolio();
  const addPortfolioMutation = useAddPortfolio();
  const deletePortfolioMutation = useDeletePortfolio();
  const { uploadFile, progress, uploading, error: storageError } = useStorage();

  const [activeCategory, setActiveCategory] = useState('all');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioCategory>('bridal-mehendi');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Filter local listings
  const filteredItems = portfolioItems?.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  }) || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleClearForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setTagsInput('');
    setIsFeatured(false);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload first.");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a title for the portfolio item.");
      return;
    }

    try {
      // 1. Upload file and obtain URL
      const downloadUrl = await uploadFile(file, 'portfolio');
      
      // 2. Parse tags
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => !!t);

      // 3. Save to database
      await addPortfolioMutation.mutateAsync({
        title,
        category,
        description,
        imageUrl: downloadUrl,
        tags,
        isFeatured
      });

      handleClearForm();
      alert("Portfolio item uploaded successfully!");
    } catch (err) {
      console.error("Failed to upload portfolio item:", err);
      alert("Failed to upload. See console logs.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this portfolio item?")) {
      try {
        await deletePortfolioMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete portfolio item:", err);
      }
    }
  };

  const categoryOptions = [
    { value: 'bridal-mehendi', label: 'Bridal Mehendi' },
    { value: 'arabic-mehendi', label: 'Arabic Mehendi' },
    { value: 'traditional-mehendi', label: 'Traditional Mehendi' },
    { value: 'bridal-makeup', label: 'Bridal Makeup' },
    { value: 'reception-makeup', label: 'Reception Makeup' },
    { value: 'party-makeup', label: 'Party Makeup' }
  ];

  return (
    <div className="space-y-10 text-left">
      
      {/* Title */}
      <div className="border-b border-brand-gold/15 pb-6">
        <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Portfolio Manager</h1>
        <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Upload and organize bridal lookbooks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload New Item Form */}
        <div className="lg:col-span-5">
          <GlassCard className="bg-brand-ivory border-brand-gold/20 p-6 space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg text-brand-green-dark font-bold flex items-center space-x-2 border-b border-brand-gold/15 pb-3">
              <ImagePlus className="w-5 h-5 text-brand-gold" />
              <span>Upload New Creation</span>
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* Image picker box */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-brand-gold/30 hover:border-brand-gold rounded p-4 text-center cursor-pointer bg-brand-beige/10 relative overflow-hidden aspect-[4/3]">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Upload Preview" className="absolute inset-0 w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreviewUrl(null);
                      }} 
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/75 text-white hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none text-brand-gold">
                    <ImagePlus className="w-8 h-8 opacity-60" />
                    <span className="font-sans text-xs font-semibold">Select Photo File</span>
                    <span className="font-sans text-[10px] text-brand-charcoal/50">Supports JPEG, PNG, WEBP</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans text-brand-charcoal/60">
                    <span>Uploading file...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-brand-beige h-1.5 rounded overflow-hidden">
                    <div className="bg-brand-green h-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {storageError && (
                <p className="text-[10px] font-sans text-red-500 mt-1">{storageError}</p>
              )}

              <Input
                label="Creation Title"
                placeholder="e.g. Lotus Motif Bridal Henna"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                label="Portfolio Category"
                as="select"
                options={categoryOptions}
                value={category}
              onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
            />

              <Input
                label="Description"
                as="textarea"
                placeholder="Describe styling details, jewelry matches, location, or skin glow base highlights..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Input
                label="Tags (Comma separated)"
                placeholder="bridal, portraits, full-hand, dewy, lashes"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />

              {/* Is Featured Checkbox */}
              <div className="flex items-center space-x-2.5 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-brand-gold/30 text-brand-green focus:ring-brand-gold"
                />
                <label htmlFor="isFeatured" className="font-sans text-xs uppercase tracking-wider font-semibold text-brand-green/80 cursor-pointer">
                  Feature on Homepage
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClearForm} 
                  className="w-1/2 justify-center border-brand-gold text-brand-green"
                >
                  Clear Form
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-1/2 justify-center shadow-lg"
                  disabled={uploading || !file || !title}
                >
                  Upload Item
                </Button>
              </div>

            </form>
          </GlassCard>
        </div>

        {/* Right Column: Active Listings & Filters */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-serif text-xl text-brand-green-dark font-bold">Active Listings</h3>
            
            {/* Category selection */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-3 py-1.5 bg-brand-ivory text-brand-charcoal text-xs border border-brand-gold/30 focus:outline-none rounded cursor-pointer font-sans"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Grid listing */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-brand-beige/10 border border-brand-gold/15 rounded">
              <p className="font-serif text-base text-brand-charcoal/50">No portfolio items found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <GlassCard key={item.id} className="bg-brand-ivory border-brand-gold/15 p-4 flex flex-col" hoverEffect={false}>
                  {/* Photo Frame */}
                  <div className="aspect-[4/3] w-full rounded overflow-hidden mb-4 border border-brand-gold/10 relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    {item.isFeatured && (
                      <div className="absolute top-2 left-2 bg-brand-gold text-brand-green-dark text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded shadow">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="text-left flex-grow space-y-1.5">
                    <span className="text-[8px] font-sans text-brand-gold uppercase tracking-widest font-semibold block">
                      {item.category.replace('-', ' ')}
                    </span>
                    <h4 className="font-serif text-base text-brand-green font-bold truncate">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[11px] text-brand-charcoal/60 leading-normal line-clamp-2">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-gold/10 flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-0.5">
                      {item.tags?.slice(0, 2).map((t: string) => (
                        <span key={t} className="text-[9px] font-sans bg-brand-beige text-brand-charcoal/70 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default ManagePortfolio;
