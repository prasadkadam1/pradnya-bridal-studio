import React from 'react';
import { Link } from 'react-router-dom';
import { useInquiries, usePortfolio, useTestimonials } from '../../hooks/useFirestore';
import { GlassCard } from '../../components/ui/GlassCard';
import { 
  Users, ImagePlus, Star, TrendingUp, CalendarCheck, ArrowRight 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: inquiries } = useInquiries();
  const { data: portfolio } = usePortfolio();
  const { data: testimonials } = useTestimonials();

  // Calculations
  const totalLeads = inquiries?.length || 0;
  
  // Calculate leads received this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyLeads = inquiries?.filter(inq => {
    const d = new Date(inq.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length || 0;

  const totalPortfolio = portfolio?.length || 0;
  const totalReviews = testimonials?.length || 0;

  // Split inquiries by event type
  const getServiceRatio = (typeSlug: string) => {
    if (!inquiries) return 0;
    const count = inquiries.filter(inq => inq.eventType.toLowerCase().includes(typeSlug)).length;
    return count;
  };

  const comboCount = getServiceRatio('combo');
  const makeupCount = getServiceRatio('makeup');
  const mehendiCount = getServiceRatio('mehendi');

  const stats = [
    { label: "Total Inquiries", val: totalLeads, desc: "All-time bookings leads", icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Monthly Leads", val: monthlyLeads, desc: "Submitted in current month", icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "Active Gallery", val: totalPortfolio, desc: "Portfolio items online", icon: ImagePlus, color: "text-yellow-600 bg-yellow-100" },
    { label: "Client Reviews", val: totalReviews, desc: "Star ratings testimonies", icon: Star, color: "text-purple-600 bg-purple-100" }
  ];

  // Latest 4 inquiries
  const recentInquiries = inquiries?.slice(0, 4) || [];

  return (
    <div className="space-y-10 text-left">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-gold/15 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Studio Overview</h1>
          <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Real-time indicators and operational stats.</p>
        </div>
        
        {/* Quick Access CTAs */}
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Link to="/admin/leads" className="bg-brand-green hover:bg-brand-green-dark text-brand-ivory text-xs px-4 py-2.5 rounded shadow font-sans font-semibold tracking-wider uppercase transition-colors">
            Manage Inquiries
          </Link>
          <Link to="/admin/portfolio" className="border border-brand-gold text-brand-green bg-transparent hover:bg-brand-gold/10 text-xs px-4 py-2.5 rounded shadow font-sans font-semibold tracking-wider uppercase transition-colors">
            Upload Work
          </Link>
        </div>
      </div>

      {/* Grid statistics metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={idx} className="bg-brand-ivory border-brand-gold/15 p-6" hoverEffect={true}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-sans text-brand-charcoal/50 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-serif font-bold text-brand-green-dark mt-1">{stat.val}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-[11px] font-sans text-brand-charcoal/60 mt-3 border-t border-brand-gold/5 pt-2">{stat.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Grid: Recent Inquiries & Inquiries split ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Inquiries Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl text-brand-green-dark font-bold">Recent Leads</h3>
            <Link to="/admin/leads" className="flex items-center space-x-1 text-xs font-sans text-brand-gold hover:text-brand-gold-dark font-semibold uppercase tracking-wider">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-brand-ivory border border-brand-gold/15 rounded overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-brand-beige border-b border-brand-gold/15 text-brand-green-dark uppercase font-semibold text-[10px] tracking-wider">
                    <th className="py-4 px-6">Client</th>
                    <th className="py-4 px-6">Event Type</th>
                    <th className="py-4 px-6">Event Date</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/5">
                  {recentInquiries.length > 0 ? (
                    recentInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-brand-beige/10 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-brand-green-dark">{inq.name}</p>
                          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">{inq.phone}</p>
                        </td>
                        <td className="py-4 px-6 font-medium text-brand-charcoal/80">
                          {inq.eventType}
                        </td>
                        <td className="py-4 px-6 text-brand-charcoal/70">
                          {new Date(inq.eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                            inq.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            inq.status === 'booked' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-brand-charcoal/50">
                        No inquiries received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Service Split Analytics */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-serif text-xl text-brand-green-dark font-bold">Category Distribution</h3>
          
          <GlassCard className="bg-brand-ivory border-brand-gold/15 p-6" hoverEffect={false}>
            <h4 className="font-sans text-xs uppercase tracking-wider text-brand-gold font-bold mb-6">Inquiry Types</h4>
            
            <div className="space-y-4 text-xs font-sans">
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-brand-charcoal/80">Mehendi & Makeup Combos</span>
                  <span className="font-bold text-brand-green">{comboCount} Leads</span>
                </div>
                <div className="w-full bg-brand-beige h-2 rounded overflow-hidden">
                  <div className="bg-brand-green h-full rounded" style={{ width: `${totalLeads ? (comboCount / totalLeads) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-brand-charcoal/80">Makeup Packages Only</span>
                  <span className="font-bold text-brand-green">{makeupCount} Leads</span>
                </div>
                <div className="w-full bg-brand-beige h-2 rounded overflow-hidden">
                  <div className="bg-brand-gold h-full rounded" style={{ width: `${totalLeads ? (makeupCount / totalLeads) * 100 : 0}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-brand-charcoal/80">Mehendi Work Only</span>
                  <span className="font-bold text-brand-green">{mehendiCount} Leads</span>
                </div>
                <div className="w-full bg-brand-beige h-2 rounded overflow-hidden">
                  <div className="bg-brand-green-light h-full rounded" style={{ width: `${totalLeads ? (mehendiCount / totalLeads) * 100 : 0}%` }} />
                </div>
              </div>

            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard className="bg-brand-beige/25 border-brand-gold/15 p-6 text-left" hoverEffect={false}>
            <div className="flex items-start space-x-3.5">
              <CalendarCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-sm text-brand-green font-bold">Booking Status</h4>
                <p className="font-sans text-[11px] text-brand-charcoal/70 mt-1 leading-relaxed">
                  View and manage active wedding dates, fully booked days, or limited slots through the availability calendar manager.
                </p>
                <Link to="/admin/availability" className="inline-flex items-center space-x-1 text-[10px] font-sans text-brand-gold hover:text-brand-gold-dark font-bold uppercase tracking-widest mt-3.5">
                  <span>Manage Calendar</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
