import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

const AppLayout = lazy(() => import('./components/layout/AppLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const BeforeAfter = lazy(() => import('./pages/BeforeAfter'));
const Packages = lazy(() => import('./pages/Packages'));
const About = lazy(() => import('./pages/About'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Availability = lazy(() => import('./pages/Availability'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));
const AdminPortfolio = lazy(() => import('./pages/admin/ManagePortfolio'));
const AdminServices = lazy(() => import('./pages/admin/ManageServices'));
const AdminBlogs = lazy(() => import('./pages/admin/ManageBlogs'));
const AdminTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));
const AdminAvailability = lazy(() => import('./pages/admin/Availability'));

// Initialize TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="before-after" element={<BeforeAfter />} />
              <Route path="packages" element={<Packages />} />
              <Route path="about" element={<About />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="contact" element={<Contact />} />
              <Route path="availability" element={<Availability />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="availability" element={<AdminAvailability />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const RouteLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-ivory text-brand-green-dark">
    <div className="text-center space-y-3">
      <div className="mx-auto h-10 w-10 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
      <p className="font-sans text-xs tracking-widest uppercase text-brand-gold font-semibold">
        Loading experience...
      </p>
    </div>
  </div>
);

export default App;
