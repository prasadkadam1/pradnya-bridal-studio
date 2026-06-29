import React, { useState } from 'react';
import { useAvailability, useUpdateAvailability } from '../../hooks/useFirestore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { AlertTriangle, Trash2, CalendarCheck } from 'lucide-react';
import type { AvailabilityStatus } from '../../types/studio';

export const Availability: React.FC = () => {
  const { data: availabilityList, isLoading } = useAvailability();
  const updateAvailabilityMutation = useUpdateAvailability();

  // Form Fields
  const [selectedDate, setSelectedDate] = useState('');
  const [status, setStatus] = useState<AvailabilityStatus>('booked');
  const [notes, setNotes] = useState('');

  const handleSubmitOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date to override.");
      return;
    }

    try {
      await updateAvailabilityMutation.mutateAsync({
        date: selectedDate,
        status,
        notes
      });
      setSelectedDate('');
      setNotes('');
      alert("Date booking status updated successfully!");
    } catch (err) {
      console.error("Failed to update availability:", err);
      alert("Failed to save changes.");
    }
  };

  const handleRemoveOverride = async (date: string) => {
    if (window.confirm(`Reset booking status for date ${date}?`)) {
      try {
        // In Firestore or dbService, removing the override means setting it as 'available'
        await updateAvailabilityMutation.mutateAsync({
          date,
          status: 'available',
          notes: ''
        });
        alert("Status reset to Available.");
      } catch (err) {
        console.error("Failed to reset availability:", err);
      }
    }
  };

  const statusOptions = [
    { value: 'booked', label: 'Fully Booked / Locked' },
    { value: 'limited', label: 'Limited Slots Remaining' },
    { value: 'available', label: 'Available' }
  ];

  return (
    <div className="space-y-10 text-left">
      
      {/* Title */}
      <div className="border-b border-brand-gold/15 pb-6">
        <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Booking Calendar</h1>
        <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Manage studio date locks and slots availability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Set Calendar Override Form */}
        <div className="lg:col-span-5">
          <GlassCard className="bg-brand-ivory border-brand-gold/20 p-6 space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg text-brand-green-dark font-bold flex items-center space-x-2 border-b border-brand-gold/15 pb-3">
              <CalendarCheck className="w-5 h-5 text-brand-gold" />
              <span>Override Date Status</span>
            </h3>

            <form onSubmit={handleSubmitOverride} className="space-y-4">
              
              <Input
                label="Target Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <Input
              label="Booking Status"
              as="select"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
            />

              <Input
                label="Calendar Note / Details"
                as="textarea"
                placeholder="e.g. Bridal makeup booked for Sheraton Grand, PCMC"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full justify-center shadow-lg pt-3.5"
                disabled={updateAvailabilityMutation.isPending || !selectedDate}
              >
                Apply Date Blockout
              </Button>

            </form>
          </GlassCard>
        </div>

        {/* Right Column: Blocked Dates Listing */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-xl text-brand-green-dark font-bold">Status Overrides</h3>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !availabilityList || availabilityList.length === 0 ? (
            <div className="text-center py-16 bg-brand-beige/10 border border-brand-gold/15 rounded">
              <p className="font-serif text-base text-brand-charcoal/50">No calendar overrides set. All dates default to Available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availabilityList
                .filter(item => item.status !== 'available') // only display blocked or limited overrides
                .map((item) => (
                  <div 
                    key={item.date} 
                    className={`p-5 rounded border flex items-center justify-between gap-4 bg-brand-ivory shadow-sm ${
                      item.status === 'booked' 
                        ? 'border-red-200 bg-red-50/10' 
                        : 'border-yellow-200 bg-yellow-50/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5 text-left font-sans text-xs">
                      {item.status === 'booked' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                      )}
                      
                      <div>
                        <p className="font-serif text-base font-bold text-brand-green-dark">
                          {new Date(item.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                        </p>
                        <p className="text-[10px] text-brand-charcoal/50 mt-0.5 uppercase tracking-wider font-bold">
                          Status: <span className={item.status === 'booked' ? 'text-red-700' : 'text-yellow-700'}>{item.status}</span>
                        </p>
                        {item.notes && (
                          <p className="text-brand-charcoal/80 mt-1.5 leading-relaxed">{item.notes}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveOverride(item.date)}
                      className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 transition-colors shrink-0"
                      title="Clear Blockout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default Availability;
