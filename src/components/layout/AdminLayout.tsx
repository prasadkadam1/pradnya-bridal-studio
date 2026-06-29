import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, Users, ImagePlus, CalendarDays, LogOut, Menu, X, ClipboardList, FileText, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/leads', label: 'Inquiries/Leads', icon: Users },
  { path: '/admin/portfolio', label: 'Manage Portfolio', icon: ImagePlus },
  { path: '/admin/availability', label: 'Availability', icon: CalendarDays },
  { path: '/admin/services', label: 'Manage Services', icon: ClipboardList },
  { path: '/admin/blogs', label: 'Manage Blogs', icon: FileText },
  { path: '/admin/testimonials', label: 'Manage Reviews', icon: Heart },
];

export const AdminLayout: React.FC = () => {
  const { user, loading, logout, isMockMode } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Auth gate check
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-sans text-xs tracking-wider uppercase font-semibold text-brand-gold">
            Loading Admin Panel...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const activeClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-sans tracking-wide transition-all ${
      isActive 
        ? 'bg-brand-gold text-brand-green-dark font-semibold shadow' 
        : 'text-brand-ivory/70 hover:text-brand-ivory hover:bg-brand-green-light/40'
    }`;

  return (
    <div className="min-h-screen bg-brand-beige/40 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden w-full bg-brand-green-dark text-brand-ivory flex justify-between items-center px-4 sm:px-6 py-4 border-b border-brand-gold/20 shadow-md">
        <div className="flex flex-col">
          <span className="font-serif text-lg tracking-wider text-brand-gold font-bold">
            PRADNYA ADMIN
          </span>
          {isMockMode && (
            <span className="font-sans text-[8px] uppercase tracking-widest text-brand-gold-champagne font-bold">
              Demo Mock Mode
            </span>
          )}
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md text-brand-gold focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-brand-green-dark text-brand-ivory border-r border-brand-gold/20 shadow-xl shrink-0">
        <div className="px-6 py-8 border-b border-brand-gold/15 flex flex-col">
          <span className="font-serif text-xl tracking-wider text-brand-gold font-bold">
            PRADNYA BRIDAL
          </span>
          <span className="font-sans text-[10px] tracking-widest text-brand-gold-champagne uppercase font-medium mt-1">
            Studio Admin Panel
          </span>
          {isMockMode && (
            <span className="inline-block mt-2 self-start bg-brand-gold/10 text-brand-gold text-[9px] px-2 py-0.5 rounded font-sans uppercase font-bold border border-brand-gold/20">
              Demo Active
            </span>
          )}
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-grow px-4 py-6 space-y-2 overflow-y-auto">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.path} to={link.path} className={activeClass}>
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Sign Out */}
        <div className="p-4 border-t border-brand-gold/15 bg-brand-green-dark/60">
          <div className="mb-3 px-2">
            <p className="text-[10px] font-sans text-brand-gold-champagne uppercase tracking-widest">Logged in as</p>
            <p className="text-xs font-sans truncate text-brand-ivory/80 font-medium">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-sans tracking-wide text-red-300 hover:text-white hover:bg-red-950/40 border border-red-950/20 hover:border-red-800/40 transition-all font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[88vw] max-w-xs bg-brand-green-dark text-brand-ivory flex flex-col p-6 md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 border-b border-brand-gold/15 pb-4">
                <div className="flex flex-col">
                  <span className="font-serif text-lg tracking-wider text-brand-gold font-bold">
                    PRADNYA
                  </span>
                  <span className="font-sans text-[8px] uppercase text-brand-gold-champagne tracking-widest">
                    Studio Management
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-md text-brand-gold focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col space-y-2 overflow-y-auto flex-grow">
                {ADMIN_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebarOpen(false)}
                      className={activeClass}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-brand-gold/15 mt-auto">
                <div className="mb-4 px-2">
                  <p className="text-[9px] font-sans text-brand-gold-champagne uppercase tracking-widest">Logged in</p>
                  <p className="text-xs font-sans truncate text-brand-ivory/80">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-md text-sm font-sans tracking-wide text-red-300 border border-red-950 hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel Content Area */}
      <main className="flex-grow p-4 sm:p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};
export default AdminLayout;
