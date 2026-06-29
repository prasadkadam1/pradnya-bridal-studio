import React, { useState } from 'react';
import {
  useInquiries,
  useUpdateInquiryStatus,
  useDeleteInquiry,
  useUpdateInquiryFollowUp,
} from '../../hooks/useFirestore';
import { Button } from '../../components/common/Button';
import {
  Search,
  Download,
  Trash2,
  Eye,
  X,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock3,
  StickyNote,
  Send,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Inquiry, QuickReplyTemplate } from '../../types/studio';
import { QUICK_REPLY_TEMPLATES } from '../../data/firestoreSeedData';

export const Leads: React.FC = () => {
  const { data: inquiries, isLoading } = useInquiries();
  const updateStatusMutation = useUpdateInquiryStatus();
  const updateFollowUpMutation = useUpdateInquiryFollowUp();
  const deleteInquiryMutation = useDeleteInquiry();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(QUICK_REPLY_TEMPLATES[0].id);
  const [followUpDateDraft, setFollowUpDateDraft] = useState('');
  const [reminderNotesDraft, setReminderNotesDraft] = useState('');
  const [internalNotesDraft, setInternalNotesDraft] = useState('');
  const [contactChannelDraft, setContactChannelDraft] = useState<Inquiry['preferredContactChannel']>('whatsapp');
  const [lastContactMessageDraft, setLastContactMessageDraft] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  // Filter inquiries
  const filteredInquiries = inquiries?.filter(inq => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    
    const searchText = `${inq.name} ${inq.phone} ${inq.location} ${inq.eventType}`.toLowerCase();
    const matchesSearch = searchText.includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  }) || [];

  const selectedTemplate = QUICK_REPLY_TEMPLATES.find(
    (template) => template.id === selectedTemplateId
  ) || QUICK_REPLY_TEMPLATES[0];

  const formatTemplate = (template: QuickReplyTemplate, inquiry: Inquiry) =>
    template.message
      .replaceAll('{name}', inquiry.name)
      .replaceAll('{eventDate}', new Date(inquiry.eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' }))
      .replaceAll('{eventType}', inquiry.eventType)
      .replaceAll('{location}', inquiry.location);

  const buildWhatsAppUrl = (message: string, phoneNumber: string) =>
    `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  // Export to CSV Natively
  const exportToCSV = () => {
    if (filteredInquiries.length === 0) return;

    const headers = [
      "Inquiry ID",
      "Name",
      "Phone",
      "WhatsApp",
      "Email",
      "Event Type",
      "Event Date",
      "Location",
      "Budget",
      "Guests Count",
      "Message",
      "Status",
      "Next Follow-up",
      "Reminder Notes",
      "Internal Notes",
      "Preferred Channel",
      "Last Contacted",
      "Last Reply",
      "Created At",
    ];
    const rows = filteredInquiries.map(inq => [
      inq.id,
      inq.name,
      inq.phone,
      inq.whatsappNumber,
      inq.email,
      inq.eventType,
      inq.eventDate,
      inq.location,
      inq.budget || '',
      inq.numberOfPeople || 1,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      inq.status,
      inq.nextFollowUpDate || '',
      `"${(inq.reminderNotes || '').replace(/"/g, '""')}"`,
      `"${(inq.internalNotes || '').replace(/"/g, '""')}"`,
      inq.preferredContactChannel || '',
      inq.lastContactedAt || '',
      `"${(inq.lastContactMessage || '').replace(/"/g, '""')}"`,
      inq.createdAt
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bridal_inquiries_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as Inquiry['status'] } : prev));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const hydrateFollowUpDrafts = (inquiry: Inquiry) => {
    setFollowUpDateDraft(inquiry.nextFollowUpDate || '');
    setReminderNotesDraft(inquiry.reminderNotes || '');
    setInternalNotesDraft(inquiry.internalNotes || '');
    setContactChannelDraft(inquiry.preferredContactChannel || 'whatsapp');
    setLastContactMessageDraft(inquiry.lastContactMessage || '');
    setSavedMessage('');
  };

  const handleOpenInquiry = (inquiry: Inquiry) => {
    hydrateFollowUpDrafts(inquiry);
    setSelectedInquiry(inquiry);
  };

  const handleSaveFollowUp = async () => {
    if (!selectedInquiry) return;

    try {
      const updated = await updateFollowUpMutation.mutateAsync({
        id: selectedInquiry.id,
        data: {
          nextFollowUpDate: followUpDateDraft || undefined,
          reminderNotes: reminderNotesDraft || undefined,
          internalNotes: internalNotesDraft || undefined,
          preferredContactChannel: contactChannelDraft,
          lastContactedAt: selectedInquiry.lastContactedAt || undefined,
          lastContactMessage: lastContactMessageDraft || undefined,
        },
      });

      setSelectedInquiry((prev) => (prev ? { ...prev, ...updated } : prev));
      setSavedMessage('Follow-up saved.');
    } catch (error) {
      console.error('Failed to save follow-up:', error);
    }
  };

  const handleSendQuickReply = async () => {
    if (!selectedInquiry) return;

    const message = formatTemplate(selectedTemplate, selectedInquiry);
    const waUrl = buildWhatsAppUrl(message, selectedInquiry.whatsappNumber || selectedInquiry.phone);
    const replyWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');

    try {
      const now = new Date().toISOString();
      await updateFollowUpMutation.mutateAsync({
        id: selectedInquiry.id,
        data: {
          preferredContactChannel: 'whatsapp',
          lastContactedAt: now,
          lastContactMessage: message,
          nextFollowUpDate: followUpDateDraft || selectedInquiry.nextFollowUpDate,
          reminderNotes: reminderNotesDraft || selectedInquiry.reminderNotes,
          internalNotes: internalNotesDraft || selectedInquiry.internalNotes,
        },
      });

      await updateStatusMutation.mutateAsync({ id: selectedInquiry.id, status: 'contacted' });
      setSelectedInquiry((prev) =>
        prev
          ? {
              ...prev,
              status: 'contacted',
              lastContactedAt: now,
              lastContactMessage: message,
            }
          : prev
      );
      setSavedMessage('WhatsApp reply prepared and lead marked contacted.');
      if (!replyWindow) {
        setSavedMessage('WhatsApp reply prepared. Browser pop-up was blocked, so open WhatsApp manually if needed.');
      }
    } catch (error) {
      console.error('Failed to send quick reply:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiryMutation.mutateAsync(id);
        setSelectedInquiry(null);
      } catch (err) {
        console.error("Failed to delete inquiry:", err);
      }
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-gold/15 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Booking Inquiries</h1>
          <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Review and manage client leads.</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={exportToCSV}
          disabled={filteredInquiries.length === 0}
          className="flex items-center space-x-2 text-brand-green border-brand-green mt-4 sm:mt-0 font-semibold"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-ivory border border-brand-gold/15 p-4 rounded shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-gold">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search inquiries (Name, Phone, Location)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-brand-ivory border border-brand-gold/25 focus:border-brand-gold rounded focus:outline-none font-sans text-xs"
          />
        </div>

        {/* Status filters */}
        <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['all', 'new', 'contacted', 'booked', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider transition-all border ${
                statusFilter === status
                  ? 'bg-brand-green text-brand-ivory border-brand-green'
                  : 'bg-transparent text-brand-green-dark/75 border-brand-gold/20 hover:border-brand-gold'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Inquiries table list */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-16 bg-brand-beige/10 border border-brand-gold/15 rounded">
          <p className="font-serif text-lg text-brand-green">No inquiries found matching criteria</p>
        </div>
      ) : (
        <div className="bg-brand-ivory border border-brand-gold/15 rounded overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-brand-beige border-b border-brand-gold/15 text-brand-green-dark uppercase font-semibold text-[10px] tracking-widest">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Event details</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/5">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-brand-beige/5 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-brand-green-dark text-sm">{inq.name}</p>
                      <p className="text-[10px] text-brand-charcoal/50 mt-0.5">{inq.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-brand-charcoal/80">{inq.eventType}</p>
                      <p className="text-[10px] text-brand-charcoal/50 mt-0.5 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-brand-gold" />
                        <span>{new Date(inq.eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      </p>
                    </td>
                    <td className="py-4 px-6 text-brand-charcoal/70">
                      <p className="font-medium">{inq.location}</p>
                      {inq.numberOfPeople > 1 && (
                        <p className="text-[10px] text-brand-charcoal/50 mt-0.5">Guests: {inq.numberOfPeople}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full border text-[9px] uppercase font-bold tracking-wider focus:outline-none cursor-pointer ${
                          inq.status === 'new' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                          inq.status === 'contacted' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                          inq.status === 'booked' ? 'bg-green-50 border-green-200 text-green-800' :
                          'bg-gray-50 border-gray-200 text-gray-800'
                        }`}
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="booked">booked</option>
                        <option value="archived">archived</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleOpenInquiry(inq)}
                          className="p-1.5 rounded bg-brand-beige/35 text-brand-green hover:bg-brand-green/10 transition-colors border border-brand-gold/15"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiry detail Popup Drawer */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Click outside container to close */}
            <div className="absolute inset-0" onClick={() => setSelectedInquiry(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 max-w-lg w-full bg-brand-ivory border border-brand-gold/30 rounded shadow-2xl overflow-hidden text-left"
            >
              
              {/* Header card */}
              <div className="bg-brand-green-dark text-brand-ivory px-6 py-4 flex justify-between items-center border-b border-brand-gold/20">
                <div>
                  <h3 className="font-serif text-lg text-brand-gold font-bold">Inquiry Specifications</h3>
                  <p className="text-[10px] font-sans text-brand-ivory/60 mt-0.5">ID: {selectedInquiry.id}</p>
                </div>
                
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1 rounded-md text-brand-gold hover:bg-brand-green/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                
                {/* Client contacts */}
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-brand-gold" />
                    <span className="font-bold text-brand-green-dark text-base">{selectedInquiry.name}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-brand-charcoal/80 pt-2 border-t border-brand-gold/5">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{selectedInquiry.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-3.5 h-3.5 text-green-500 fill-green-500/20" />
                      <a 
                        href={`https://wa.me/${selectedInquiry.whatsappNumber}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 font-semibold hover:underline"
                      >
                        {selectedInquiry.whatsappNumber}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Mail className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{selectedInquiry.email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded border border-brand-gold/15 bg-brand-beige/25 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-4 h-4 text-brand-gold" />
                      <p className="font-sans text-[10px] uppercase tracking-widest text-brand-charcoal/50 font-semibold">
                        Follow-up Plan
                      </p>
                    </div>
                    {savedMessage && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-green">
                        <CheckCircle2 className="w-3 h-3" />
                        {savedMessage}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50">
                        Next Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={followUpDateDraft}
                        onChange={(e) => setFollowUpDateDraft(e.target.value)}
                        className="w-full rounded border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50">
                        Preferred Channel
                      </label>
                      <select
                        value={contactChannelDraft}
                        onChange={(e) => setContactChannelDraft(e.target.value as Inquiry['preferredContactChannel'])}
                        className="w-full rounded border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50">
                      Reminder Notes
                    </label>
                    <textarea
                      value={reminderNotesDraft}
                      onChange={(e) => setReminderNotesDraft(e.target.value)}
                      rows={2}
                      className="w-full rounded border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                      placeholder="What should be followed up on?"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50">
                      Internal Notes
                    </label>
                    <textarea
                      value={internalNotesDraft}
                      onChange={(e) => setInternalNotesDraft(e.target.value)}
                      rows={3}
                      className="w-full rounded border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                      placeholder="Private notes for the studio team..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50">
                      Quick Reply Template
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="w-full rounded border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs focus:border-brand-gold focus:outline-none"
                    >
                      {QUICK_REPLY_TEMPLATES.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-brand-charcoal/50">
                      Preview Message
                    </label>
                    <textarea
                      value={formatTemplate(selectedTemplate, selectedInquiry)}
                      readOnly
                      rows={5}
                      className="w-full rounded border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveFollowUp}
                      className="flex-1 justify-center border-brand-green text-brand-green"
                      loading={updateFollowUpMutation.isPending}
                    >
                      <StickyNote className="w-4 h-4 mr-2" />
                      Save Follow-up
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleSendQuickReply}
                      className="flex-1 justify-center"
                      loading={updateFollowUpMutation.isPending || updateStatusMutation.isPending}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send WhatsApp Reply
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        const message = formatTemplate(selectedTemplate, selectedInquiry);
                        await navigator.clipboard.writeText(message);
                        setLastContactMessageDraft(message);
                        setSavedMessage('Message copied to clipboard.');
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded border border-brand-gold/20 bg-brand-ivory px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-green transition-colors hover:bg-brand-beige/20"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Reply
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const now = new Date().toISOString();
                        await updateFollowUpMutation.mutateAsync({
                          id: selectedInquiry.id,
                          data: {
                            lastContactedAt: now,
                            lastContactMessage: selectedInquiry.lastContactMessage || formatTemplate(selectedTemplate, selectedInquiry),
                            preferredContactChannel: contactChannelDraft,
                          },
                        });
                        await updateStatusMutation.mutateAsync({ id: selectedInquiry.id, status: 'contacted' });
                        setSelectedInquiry((prev) =>
                          prev
                            ? {
                                ...prev,
                                status: 'contacted',
                                lastContactedAt: now,
                              }
                            : prev
                        );
                        setSavedMessage('Lead marked as contacted.');
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded border border-brand-gold/20 bg-brand-beige/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-green-dark transition-colors hover:bg-brand-beige/35"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Contacted
                    </button>
                  </div>
                </div>

                {/* Event particulars */}
                <div className="p-4 rounded border border-brand-gold/15 bg-brand-beige/25 space-y-3.5 font-sans text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Event Type</p>
                      <p className="font-bold text-brand-green-dark mt-0.5">{selectedInquiry.eventType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Event Date</p>
                      <p className="font-bold text-brand-green-dark mt-0.5">
                        {new Date(selectedInquiry.eventDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-brand-gold/10">
                    <div>
                      <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Venue Location</p>
                      <p className="font-bold text-brand-green-dark mt-0.5">{selectedInquiry.location}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Invoiced Budget</p>
                      <p className="font-bold text-brand-green mt-0.5">{selectedInquiry.budget || 'Not Specified'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-brand-gold/10">
                    <div>
                      <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Next Follow-up</p>
                      <p className="font-bold text-brand-green-dark mt-0.5">
                        {selectedInquiry.nextFollowUpDate
                          ? new Date(selectedInquiry.nextFollowUpDate).toLocaleDateString('en-IN', { dateStyle: 'long' })
                          : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Preferred Channel</p>
                      <p className="font-bold text-brand-green-dark mt-0.5 capitalize">
                        {selectedInquiry.preferredContactChannel || 'WhatsApp'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-brand-gold/10">
                    <p className="text-[10px] text-brand-charcoal/50 uppercase font-semibold">Total Guests Count</p>
                    <p className="font-bold text-brand-green-dark mt-0.5">{selectedInquiry.numberOfPeople || 1} Person(s)</p>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <p className="font-sans text-[10px] uppercase text-brand-charcoal/50 font-semibold">Client Notes</p>
                  <div className="p-3 bg-brand-ivory border border-brand-gold/10 rounded font-sans text-xs text-brand-charcoal/80 leading-relaxed italic whitespace-pre-wrap">
                    "{selectedInquiry.message || 'No additional notes provided.'}"
                  </div>
                </div>

                {selectedInquiry.lastContactedAt && (
                  <div className="p-3 rounded border border-brand-gold/10 bg-brand-ivory text-[11px] text-brand-charcoal/70">
                    Last contacted on{' '}
                    {new Date(selectedInquiry.lastContactedAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                )}

                {/* Status selector */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-gold/10 font-sans text-xs">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] uppercase text-brand-charcoal/50 font-semibold">Update Lead Status</span>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full border text-[9px] uppercase font-bold tracking-wider focus:outline-none cursor-pointer ${
                        selectedInquiry.status === 'new' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                        selectedInquiry.status === 'contacted' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                        selectedInquiry.status === 'booked' ? 'bg-green-50 border-green-200 text-green-800' :
                        'bg-gray-50 border-gray-200 text-gray-800'
                      }`}
                    >
                      <option value="new">new</option>
                      <option value="contacted">contacted</option>
                      <option value="booked">booked</option>
                      <option value="archived">archived</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="flex items-center space-x-2 py-2 px-4 rounded border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete inquiry</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Leads;
