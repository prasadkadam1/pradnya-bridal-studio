import React, { useState } from 'react';
import { useBlogs, useAddBlog, useUpdateBlog, useDeleteBlog } from '../../hooks/useFirestore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { FileText, Trash2, Edit, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { BlogPost } from '../../types/studio';

interface BlogFormInputs {
  id: string; // Dynamic Slug
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tagsInput: string;
  author: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
}

export const ManageBlogs: React.FC = () => {
  const { data: blogs, isLoading } = useBlogs();
  const addBlogMutation = useAddBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();

  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BlogFormInputs>({
    defaultValues: {
      id: '',
      title: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      tagsInput: '',
      author: 'Pradnya K.',
      metaTitle: '',
      metaDescription: '',
      published: true
    }
  });

  const onSubmit = async (data: BlogFormInputs) => {
    try {
      const slugId = data.id.trim().toLowerCase().replace(/\s+/g, '-');
      
      const tags = data.tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => !!t);

      const payload = {
        id: editingId || slugId,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        tags,
        author: data.author,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.excerpt,
        published: data.published,
        createdAt: new Date().toISOString()
      };

      if (editingId) {
        await updateBlogMutation.mutateAsync({
          id: editingId,
          data: payload
        });
      } else {
        await addBlogMutation.mutateAsync(payload);
      }

      handleCancelEdit();
      alert("Article saved successfully!");
    } catch (err) {
      console.error("Failed to save article:", err);
      alert("Failed to save article.");
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingId(post.id);
    setValue('id', post.id);
    setValue('title', post.title);
    setValue('excerpt', post.excerpt);
    setValue('content', post.content);
    setValue('coverImage', post.coverImage);
    setValue('tagsInput', post.tags?.join(', ') || '');
    setValue('author', post.author);
    setValue('metaTitle', post.metaTitle || '');
    setValue('metaDescription', post.metaDescription || '');
    setValue('published', post.published);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete blog:", err);
      }
    }
  };

  return (
    <div className="space-y-10 text-left">
      
      {/* Title */}
      <div className="border-b border-brand-gold/15 pb-6">
        <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Blog Manager</h1>
        <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Compose and publish SEO beauty articles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Editor Form */}
        <div className="lg:col-span-6">
          <GlassCard className="bg-brand-ivory border-brand-gold/20 p-6 space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg text-brand-green-dark font-bold flex items-center space-x-2 border-b border-brand-gold/15 pb-3">
              <FileText className="w-5 h-5 text-brand-gold" />
              <span>{editingId ? "Edit Blog Article" : "Write New Article"}</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {!editingId && (
                <Input
                  label="Article SEO URL Slug"
                  placeholder="e.g. skin-prep-tips-before-wedding"
                  error={errors.id?.message}
                  {...register('id', { required: 'Slug URL is required' })}
                />
              )}

              <Input
                label="Article Title"
                placeholder="e.g. Skin Preparation Secrets Before Wedding"
                error={errors.title?.message}
                {...register('title', { required: 'Title is required' })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Author Name"
                  {...register('author', { required: 'Author is required' })}
                />
                
                <Input
                  label="Cover Image URL"
                  {...register('coverImage')}
                />
              </div>

              <Input
                label="Tags (Comma separated)"
                placeholder="skin-care, bridal, makeup, Pune"
                {...register('tagsInput')}
              />

              <Input
                label="Blog Excerpt / Summary"
                placeholder="Brief summary displaying in cards..."
                error={errors.excerpt?.message}
                {...register('excerpt', { required: 'Excerpt is required' })}
              />

              <Input
                label="Body Content (Markdown / HTML Supported)"
                as="textarea"
                placeholder="Write your main article content here..."
                rows={8}
                error={errors.content?.message}
                {...register('content', { required: 'Content is required' })}
              />

              {/* SEO Specs */}
              <div className="bg-brand-beige/25 p-4 rounded border border-brand-gold/15 space-y-4">
                <h4 className="font-sans text-[10px] uppercase font-bold tracking-widest text-brand-gold">SEO Meta Configurations</h4>
                
                <Input
                  label="Meta Title Tag"
                  placeholder="Target keyword title..."
                  {...register('metaTitle')}
                />
                
                <Input
                  label="Meta Description Tag"
                  placeholder="Summarize to encourage organic clicks..."
                  {...register('metaDescription')}
                />
              </div>

              {/* Published checkbox */}
              <div className="flex items-center space-x-2.5 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={true}
                  {...register('published')}
                  className="h-4 w-4 rounded border-brand-gold/30 text-brand-green focus:ring-brand-gold"
                />
                <label htmlFor="published" className="font-sans text-xs uppercase tracking-wider font-semibold text-brand-green/80 cursor-pointer">
                  Publish Instantly (Visible on Blog feed)
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit} 
                    className="w-1/2 justify-center"
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className={`justify-center ${editingId ? 'w-1/2' : 'w-full'} shadow-lg`}
                  disabled={addBlogMutation.isPending || updateBlogMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Save Article</span>
                </Button>
              </div>

            </form>
          </GlassCard>
        </div>

        {/* Right Column: Active Blogs List */}
        <div className="lg:col-span-6 space-y-6">
          <h3 className="font-serif text-xl text-brand-green-dark font-bold">Active Articles</h3>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !blogs || blogs.length === 0 ? (
            <div className="text-center py-16 bg-brand-beige/10 border border-brand-gold/15 rounded">
              <p className="font-serif text-base text-brand-charcoal/50">No blog posts drafted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogs.map((post) => (
                <div 
                  key={post.id} 
                  className="p-4 rounded border border-brand-gold/15 bg-brand-ivory flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="text-left font-sans text-xs flex-grow">
                    <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <h4 className="font-serif text-base text-brand-green font-bold mt-1.5 leading-snug line-clamp-1">{post.title}</h4>
                    <p className="text-[10px] text-brand-charcoal/50 font-mono mt-0.5">Slug: {post.id}</p>
                    <p className="text-brand-charcoal/70 mt-1 line-clamp-2">{post.excerpt}</p>
                  </div>

                  <div className="flex space-x-2 shrink-0">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="p-1.5 rounded bg-brand-beige/35 text-brand-green hover:bg-brand-green/10 border border-brand-gold/15 transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default ManageBlogs;
