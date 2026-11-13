import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../hooks/useFirestore';
import { Button } from '../components/common/Button';
import { Divider } from '../components/common/Divider';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import updateSEOMetadata, { getCanonicalUrl } from '../services/seo';
import { getArticleSchema } from '../utils/schemaMarkup';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlog(slug || '');

  useEffect(() => {
    if (!slug) return;
    const canonicalUrl = getCanonicalUrl(`/blog/${slug}`);
    if (!post) {
      updateSEOMetadata({
        title: `${slug.replaceAll('-', ' ')} | Bridal Beauty Advice`,
        description: 'Read bridal beauty advice and wedding preparation tips from Pradnya Bridal Studio in Pune.',
        canonicalUrl,
        robots: !isLoading ? 'noindex,follow' : 'index,follow,max-image-preview:large',
      });
      document.getElementById('blog-post-schema')?.remove();
      return;
    }
    const canonicalUrlForPost = getCanonicalUrl(`/blog/${post.id}`);
    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt;
    updateSEOMetadata({
      title,
      description,
      ogType: 'article',
      ogImage: post.coverImage || undefined,
      canonicalUrl: canonicalUrlForPost,
      robots: post.published ? 'index,follow,max-image-preview:large' : 'noindex,nofollow',
    });
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'blog-post-schema';
    schema.textContent = JSON.stringify(getArticleSchema({
      title,
      description,
      url: canonicalUrlForPost,
      image: post.coverImage,
      datePublished: post.createdAt,
      author: post.author,
    }));
    document.getElementById('blog-post-schema')?.remove();
    document.head.appendChild(schema);
    return () => document.getElementById('blog-post-schema')?.remove();
  }, [post, slug, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center px-4">
        <h2 className="font-serif text-2xl text-brand-green-dark mb-4">Article Not Found</h2>
        <p className="font-sans text-sm text-brand-charcoal/70 mb-6">The blog post you are looking for does not exist.</p>
        <Link to="/blog">
          <Button variant="primary">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  // Simple Markdown-like formatter for paragraphs, lists, and headers
  const renderContent = (contentStr: string) => {
    return contentStr.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="font-serif text-3xl sm:text-4xl text-brand-green-dark font-bold tracking-wide mt-8 mb-4 text-left border-b border-brand-gold/15 pb-2">
            {trimmed.substring(2)}
          </h1>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl text-brand-green font-bold tracking-wide mt-6 mb-3 text-left">
            {trimmed.substring(3)}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl text-brand-green-dark font-semibold mt-4 mb-2 text-left">
            {trimmed.substring(4)}
          </h3>
        );
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="list-disc pl-6 space-y-2 mb-4 text-left font-sans text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item.substring(2)}</li>
            ))}
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n');
        return (
          <ol key={idx} className="list-decimal pl-6 space-y-2.5 mb-4 text-left font-sans text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed">
            {items.map((item, itemIdx) => {
              const textContent = item.replace(/^\d+\.\s+/, '');
              return <li key={itemIdx}>{textContent}</li>;
            })}
          </ol>
        );
      }

      // Check if it's a blockquote/alert
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-brand-gold bg-brand-beige/25 p-4 rounded font-serif italic text-brand-green text-sm sm:text-base leading-relaxed my-6 text-left">
            {trimmed.substring(2)}
          </blockquote>
        );
      }

      // Normal paragraph
      return (
        <p key={idx} className="font-sans text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed mb-4 text-left">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="bg-brand-ivory min-h-screen pb-24">
      
      {/* Back to list Bar */}
      <div className="bg-brand-beige/50 border-b border-brand-gold/15 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-xs font-sans font-bold text-brand-green hover:text-brand-green-dark uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Category tag */}
        <div className="flex flex-wrap gap-1.5 justify-start mb-4">
          {post.tags?.map((tag: string) => (
            <span key={tag} className="text-[10px] font-sans bg-brand-green-light/10 text-brand-green px-2.5 py-0.5 rounded font-semibold border border-brand-gold/10">
              {tag}
            </span>
          ))}
        </div>

        {/* Article Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-brand-green-dark tracking-wide font-bold mb-6 text-left leading-tight">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-sans text-brand-charcoal/60 mb-8 border-b border-brand-gold/15 pb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-brand-gold" />
            <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-gold" />
            <span>By {post.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-brand-gold" />
            <span>5 Min Read</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full aspect-[4/3] sm:aspect-[21/9] rounded overflow-hidden shadow-md border border-brand-gold/15 mb-10">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-sm max-w-none prose-headings:font-serif prose-p:font-sans">
          {renderContent(post.content)}
        </div>

        <Divider variant="dots" />

        {/* CTA box in blog */}
        <div className="mt-12 p-6 sm:p-8 rounded bg-brand-beige/35 border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-sm">
          <div>
            <h3 className="font-serif text-xl text-brand-green-dark font-bold">Prepare for Your Big Day</h3>
            <p className="font-sans text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
              Let us help you design your dream bridal look. Book a personal makeup and mehendi trial in Pune, Maharashtra.
            </p>
          </div>

          <Link to="/availability" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" className="w-full justify-center shadow">
              Book Consultation
            </Button>
          </Link>
        </div>

      </div>
    </article>
  );
};
export default BlogPost;
