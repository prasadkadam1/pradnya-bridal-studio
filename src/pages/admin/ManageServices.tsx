import React, { useState } from 'react';
import { useServices, useUpdateService, useDeleteService } from '../../hooks/useFirestore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { ClipboardList, Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Service, ServiceProcessStep } from '../../types/studio';

interface ServiceFormInputs {
  id: string;
  title: string;
  category: 'mehendi' | 'makeup' | 'styling';
  shortDescription: string;
  detailedDescription: string;
  startingPrice: number;
  duration: string;
  benefitsInput: string;
  processInput: string; // Will parse steps separated by semicolons
}

export const ManageServices: React.FC = () => {
  const { data: services, isLoading } = useServices();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServiceFormInputs>({
    defaultValues: {
      id: '',
      title: '',
      category: 'mehendi',
      shortDescription: '',
      detailedDescription: '',
      startingPrice: 5000,
      duration: '2 Hours',
      benefitsInput: '',
      processInput: ''
    }
  });

  const onSubmit = async (data: ServiceFormInputs) => {
    try {
      const slugId = data.id.trim().toLowerCase().replace(/\s+/g, '-');
      
      const benefits = data.benefitsInput
        .split(',')
        .map(b => b.trim())
        .filter(b => !!b);

      const process = data.processInput
        .split(';')
        .map((p, index) => ({
          step: index + 1,
          title: p.split(':')[0]?.trim() || `Step ${index + 1}`,
          description: p.split(':')[1]?.trim() || p.trim()
        }))
        .filter(p => !!p.description);

      const payload = {
        title: data.title,
        category: data.category,
        shortDescription: data.shortDescription,
        detailedDescription: data.detailedDescription,
        startingPrice: Number(data.startingPrice),
        duration: data.duration,
        benefits,
        process,
        portfolioExamples: [] // default empty, admin can link via portfolio images upload
      };

      await updateServiceMutation.mutateAsync({
        id: editingId || slugId,
        data: payload
      });

      handleCancelEdit();
      alert("Service saved successfully!");
    } catch (err) {
      console.error("Failed to save service:", err);
      alert("Failed to save service.");
    }
  };

  const handleEditClick = (service: Service) => {
    setEditingId(service.id);
    setValue('id', service.id);
    setValue('title', service.title);
    setValue('category', service.category);
    setValue('shortDescription', service.shortDescription);
    setValue('detailedDescription', service.detailedDescription);
    setValue('startingPrice', service.startingPrice);
    setValue('duration', service.duration);
    setValue('benefitsInput', service.benefits?.join(', ') || '');
    setValue('processInput', service.process?.map((step: ServiceProcessStep) => `${step.title}: ${step.description}`).join('; ') || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service? All detailed pages mapping this slug will be lost.")) {
      try {
        await deleteServiceMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete service:", err);
      }
    }
  };

  return (
    <div className="space-y-10 text-left">
      
      {/* Title */}
      <div className="border-b border-brand-gold/15 pb-6">
        <h1 className="font-serif text-3xl text-brand-green-dark font-bold">Services Manager</h1>
        <p className="font-sans text-xs text-brand-charcoal/60 mt-1">Configure packages and description structures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <GlassCard className="bg-brand-ivory border-brand-gold/20 p-6 space-y-6" hoverEffect={false}>
            <h3 className="font-serif text-lg text-brand-green-dark font-bold flex items-center space-x-2 border-b border-brand-gold/15 pb-3">
              <ClipboardList className="w-5 h-5 text-brand-gold" />
              <span>{editingId ? "Edit Service Offering" : "Add Service Offering"}</span>
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {!editingId && (
                <Input
                  label="Service Slug / ID"
                  placeholder="e.g. engagement-mehendi (no spaces)"
                  error={errors.id?.message}
                  {...register('id', { required: 'Slug ID is required' })}
                />
              )}

              <Input
                label="Service Title"
                placeholder="e.g. Engagement Mehendi"
                error={errors.title?.message}
                {...register('title', { required: 'Service Title is required' })}
              />

              <Input
                label="Category"
                as="select"
                options={[
                  { value: 'mehendi', label: 'Mehendi' },
                  { value: 'makeup', label: 'Makeup' },
                  { value: 'styling', label: 'Saree Draping & Hair styling' }
                ]}
                {...register('category')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Starting Price (₹)"
                  type="number"
                  error={errors.startingPrice?.message}
                  {...register('startingPrice', { required: 'Starting price is required' })}
                />
                
                <Input
                  label="Duration Descriptor"
                  placeholder="e.g. 2 - 3 Hours"
                  error={errors.duration?.message}
                  {...register('duration', { required: 'Duration is required' })}
                />
              </div>

              <Input
                label="Short Summary"
                placeholder="Exquisite standard designs for bridesmaids..."
                error={errors.shortDescription?.message}
                {...register('shortDescription', { required: 'Short description is required' })}
              />

              <Input
                label="Detailed Description"
                as="textarea"
                placeholder="Full details highlighting materials, skin safety, styles..."
                rows={3}
                error={errors.detailedDescription?.message}
                {...register('detailedDescription', { required: 'Detailed description is required' })}
              />

              <Input
                label="Benefits (Comma separated)"
                placeholder="100% organic, eucalyptus oil, long lasting"
                {...register('benefitsInput')}
              />

              <Input
                label="Process Steps (Semicolon separated, Title:Desc format)"
                as="textarea"
                placeholder="Step 1 Title:Step 1 Desc; Step 2 Title:Step 2 Desc..."
                rows={3}
                {...register('processInput')}
              />

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
                  disabled={updateServiceMutation.isPending}
                >
                  Save Service
                </Button>
              </div>

            </form>
          </GlassCard>
        </div>

        {/* Right Column: Listing */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-xl text-brand-green-dark font-bold">Active Offerings</h3>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-brand-gold" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : !services || services.length === 0 ? (
            <div className="text-center py-16 bg-brand-beige/10 border border-brand-gold/15 rounded">
              <p className="font-serif text-base text-brand-charcoal/50">No service offerings created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((srv) => (
                <div 
                  key={srv.id} 
                  className="p-5 rounded border border-brand-gold/15 bg-brand-ivory flex items-center justify-between gap-6 shadow-sm"
                >
                  <div className="text-left font-sans text-xs flex-grow">
                    <span className="text-[9px] bg-brand-beige text-brand-green-dark font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {srv.category}
                    </span>
                    <h4 className="font-serif text-lg text-brand-green font-bold mt-1.5">{srv.title}</h4>
                    <p className="text-[10px] text-brand-charcoal/50 font-mono mt-0.5">ID: {srv.id}</p>
                    <p className="text-brand-charcoal/70 mt-2 line-clamp-2 leading-relaxed">{srv.shortDescription}</p>
                    <p className="text-brand-green font-bold mt-2 text-sm">₹{srv.startingPrice.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="flex space-x-3 shrink-0">
                    <button
                      onClick={() => handleEditClick(srv)}
                      className="p-2 rounded bg-brand-beige/35 text-brand-green hover:bg-brand-green/10 border border-brand-gold/15 transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id)}
                      className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
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
export default ManageServices;
