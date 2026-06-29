import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useFirestore';
import { GlassCard } from '../components/ui/GlassCard';
import { Divider } from '../components/common/Divider';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

export const Blog: React.FC = () => {
  const { data: blogs, isLoading } = useBlogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  // Collect all unique tags
  const allTags = ['all', ...Array.from(new Set(blogs?.flatMap(b => b.tags || []) || []))];

  const filteredBlogs = blogs?.filter(b => {
    if (!b.published) return false;
    
    const matchesTag = selectedTag === 'all' || b.tags?.includes(selectedTag);
    
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  }) || [];

  return (
    <div className="bg-brand-ivory min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-sans text-xs tracking-widest uppercase text-brand-gold font-bold">Bridal Advice</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-brand-green-dark tracking-wide font-bold mt-2">
            Wedding Beauty Blog
          </h1>
          <p className="font-sans text-sm text-brand-charcoal/70 mt-3">
            Tips, guides, and trends to help you prepare your skin and style for the big day.
          </p>
          <Divider variant="simple" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-brand-gold/15 pb-8">
          
          {/* Tag Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 md:pb-0 scrollbar-thin max-w-full">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 whitespace-nowrap border shrink-0 ${
                  selectedTag === tag
                    ? 'bg-brand-green text-brand-ivory border-brand-green'
                    : 'bg-transparent text-brand-green-dark/75 border-brand-gold/25 hover:border-brand-gold'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gold">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-brand-ivory border border-brand-gold/30 rounded focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold font-sans text-xs"
            />
          </div>

        </div>

        {/* Blogs List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-brand-gold/30 rounded">
            <p className="font-serif text-lg text-brand-green">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {filteredBlogs.map((post) => (
              <GlassCard 
                key={post.id} 
                className="bg-brand-beige/10 border border-brand-gold/15 flex flex-col h-full"
                hoverEffect={true}
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/9] w-full rounded overflow-hidden mb-6 border border-brand-gold/10">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* Meta details */}
                <div className="flex items-center space-x-4 text-[10px] font-sans text-brand-charcoal/50 mb-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-brand-gold" />
                    <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-brand-gold" />
                    <span>By {post.author}</span>
                  </span>
                </div>

                {/* Heading */}
                <h2 className="font-serif text-xl sm:text-2xl text-brand-green-dark font-bold mb-3 hover:text-brand-green transition-colors leading-snug">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>

                {/* Excerpt */}
                <p className="font-sans text-xs text-brand-charcoal/80 leading-relaxed flex-grow mb-6">
                  {post.excerpt}
                </p>

                {/* Tags and CTA */}
                <div className="pt-4 border-t border-brand-gold/10 flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[9px] font-sans bg-brand-beige/50 text-brand-green px-2 py-0.5 rounded border border-brand-gold/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link 
                    to={`/blog/${post.id}`} 
                    className="flex items-center space-x-1 text-xs font-sans font-bold text-brand-gold hover:text-brand-gold-dark uppercase tracking-wider transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
export default Blog;
