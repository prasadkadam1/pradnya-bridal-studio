import React, { useRef, useState } from 'react';
import { useServices, useUpdateService, useDeleteService } from '../../hooks/useFirestore';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { ClipboardList, Trash2, Edit, ImagePlus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { Service, ServiceProcessStep } from '../../types/studio';
import { deletePortfolioImageIfUnreferenced, uploadPortfolioImage, validatePortfolioImage } from '../../services/portfolioImageService';
import { MEHENDI_ENABLED } from '../../config/siteFeatures';

interface ServiceFormInputs { id: string; title: string; category: 'mehendi' | 'makeup' | 'styling'; shortDescription: string; detailedDescription: string; startingPrice: number; duration: string; benefitsInput: string; processInput: string; }
type PendingImage = { id: string; file: File; preview: string };

export const ManageServices: React.FC = () => {
  const { data: services, isLoading } = useServices();
  const updateService = useUpdateService(); const deleteService = useDeleteService();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServiceFormInputs>({ defaultValues: { id: '', title: '', category: MEHENDI_ENABLED ? 'mehendi' : 'makeup', shortDescription: '', detailedDescription: '', startingPrice: 5000, duration: '2 Hours', benefitsInput: '', processInput: '' } });
  const busy = updateService.isPending || progress !== null;

  const resetEditor = () => { pendingImages.forEach((item) => URL.revokeObjectURL(item.preview)); setEditingId(null); setSavedImages([]); setPendingImages([]); reset(); };
  const selectImages = (files: FileList | null) => {
    if (!files?.length) return;
    const selected: PendingImage[] = [];
    for (const file of Array.from(files)) try { validatePortfolioImage(file); selected.push({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }); } catch (error) { setMessage({ text: error instanceof Error ? error.message : 'Invalid image.', error: true }); }
    setPendingImages((current) => [...current, ...selected]); if (fileInput.current) fileInput.current.value = '';
  };
  const edit = (service: Service) => {
    resetEditor(); setEditingId(service.id); setSavedImages(service.portfolioExamples || []);
    setValue('id', service.id); setValue('title', service.title); setValue('category', service.category); setValue('shortDescription', service.shortDescription); setValue('detailedDescription', service.detailedDescription); setValue('startingPrice', service.startingPrice); setValue('duration', service.duration); setValue('benefitsInput', service.benefits.join(', ')); setValue('processInput', service.process.map((step: ServiceProcessStep) => `${step.title}: ${step.description}`).join('; '));
  };
  const moveImage = (index: number, shift: -1 | 1) => setSavedImages((current) => { const target = index + shift; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const submit = async (data: ServiceFormInputs) => {
    const id = editingId || data.id.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) return setMessage({ text: 'A service ID is required before uploading images.', error: true });
    setMessage(null); const original = services?.find((service) => service.id === id)?.portfolioExamples || [];
    const uploaded: string[] = [];
    try {
      for (let index = 0; index < pendingImages.length; index += 1) {
        setProgress(Math.round(index / pendingImages.length * 100));
        uploaded.push(await uploadPortfolioImage(pendingImages[index].file, id, (value) => setProgress(Math.round((index + value / 100) / pendingImages.length * 100))));
      }
      const benefits = data.benefitsInput.split(',').map((value) => value.trim()).filter(Boolean);
      const process = data.processInput.split(';').map((value, index) => ({ step: index + 1, title: value.split(':')[0]?.trim() || `Step ${index + 1}`, description: value.split(':').slice(1).join(':').trim() || value.trim() })).filter((value) => Boolean(value.description));
      await updateService.mutateAsync({ id, data: { title: data.title, category: data.category, shortDescription: data.shortDescription, detailedDescription: data.detailedDescription, startingPrice: Number(data.startingPrice), duration: data.duration, benefits, process, portfolioExamples: [...savedImages, ...uploaded] } });
      await Promise.allSettled(original.filter((url) => !savedImages.includes(url)).map((url) => deletePortfolioImageIfUnreferenced(url, id)));
      setProgress(null); resetEditor(); setMessage({ text: 'Service and portfolio images saved successfully.' });
    } catch (error) {
      setProgress(null); await Promise.allSettled(uploaded.map((url) => deletePortfolioImageIfUnreferenced(url, id)));
      setMessage({ text: error instanceof Error ? error.message : 'Could not save. Existing images were left unchanged.', error: true });
    }
  };
  return <div className="space-y-10 text-left">
    <div className="border-b border-brand-gold/15 pb-6"><h1 className="font-serif text-3xl text-brand-green-dark font-bold">Services Manager</h1><p className="font-sans text-xs text-brand-charcoal/60 mt-1">Configure services and upload their real portfolio photographs.</p></div>
    {message && <p role={message.error ? 'alert' : 'status'} className={`rounded border px-4 py-3 text-xs ${message.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-800'}`}>{message.text}</p>}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div className="lg:col-span-5"><GlassCard className="bg-brand-ivory border-brand-gold/20 p-6 space-y-6" hoverEffect={false}>
      <h3 className="font-serif text-lg text-brand-green-dark font-bold flex items-center gap-2 border-b border-brand-gold/15 pb-3"><ClipboardList className="w-5 h-5 text-brand-gold" />{editingId ? 'Edit Service Offering' : 'Add Service Offering'}</h3>
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        {!editingId && <Input label="Service Slug / ID" placeholder="e.g. bridal-makeup" error={errors.id?.message} {...register('id', { required: 'Slug ID is required' })} />}
        <Input label="Service Title" error={errors.title?.message} {...register('title', { required: 'Service Title is required' })} />
        <Input label="Category" as="select" options={[{ value: 'mehendi', label: 'Mehendi' }, { value: 'makeup', label: 'Makeup' }, { value: 'styling', label: 'Saree Draping & Hair styling' }]} {...register('category')} />
        <div className="grid grid-cols-2 gap-4"><Input label="Starting Price (₹)" type="number" error={errors.startingPrice?.message} {...register('startingPrice', { required: 'Starting price is required' })} /><Input label="Duration" error={errors.duration?.message} {...register('duration', { required: 'Duration is required' })} /></div>
        <Input label="Short Summary" error={errors.shortDescription?.message} {...register('shortDescription', { required: 'Short description is required' })} /><Input label="Detailed Description" as="textarea" rows={3} error={errors.detailedDescription?.message} {...register('detailedDescription', { required: 'Detailed description is required' })} /><Input label="Benefits (Comma separated)" {...register('benefitsInput')} /><Input label="Process Steps (Semicolon separated, Title:Desc)" as="textarea" rows={3} {...register('processInput')} />
        <div className="space-y-3 border-t border-brand-gold/15 pt-5"><div><p className="font-serif text-base font-bold text-brand-green-dark">Portfolio images</p><p className="font-sans text-[10px] text-brand-charcoal/60">JPG, PNG or WebP, up to 15 MB. Images are resized to 2000 px and converted to WebP before upload.</p></div><input ref={fileInput} className="hidden" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => selectImages(event.target.files)} /><Button type="button" variant="outline" className="w-full justify-center" onClick={() => fileInput.current?.click()} disabled={busy}><ImagePlus className="mr-2 h-4 w-4" />Add images</Button>
          {progress !== null && <div><div className="h-1.5 rounded bg-brand-beige"><div className="h-full rounded bg-brand-gold" style={{ width: `${progress}%` }} /></div><p className="mt-1 text-[10px] text-brand-charcoal/60">Uploading images: {progress}%</p></div>}
          {(savedImages.length > 0 || pendingImages.length > 0) && <div className="grid grid-cols-2 gap-3">{savedImages.map((url, index) => <div key={url} className="relative aspect-square overflow-hidden rounded border border-brand-gold/20"><img src={url} alt={`Saved portfolio image ${index + 1}`} className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-brand-green-dark/80 p-1 text-brand-ivory"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>←</button><span className="text-[9px]">{index === 0 ? 'Primary' : index + 1}</span><button type="button" onClick={() => moveImage(index, 1)} disabled={index === savedImages.length - 1}>→</button><button type="button" onClick={() => setSavedImages((current) => current.filter((item) => item !== url))} aria-label="Remove image"><X className="h-3 w-3" /></button></div></div>)}{pendingImages.map((image) => <div key={image.id} className="relative aspect-square overflow-hidden rounded border border-dashed border-brand-gold"><img src={image.preview} alt="New portfolio image preview" className="h-full w-full object-cover" /><button type="button" onClick={() => setPendingImages((current) => current.filter((item) => item.id !== image.id))} className="absolute right-1 top-1 rounded bg-brand-green-dark/80 p-1 text-brand-ivory" aria-label="Remove selected image"><X className="h-3 w-3" /></button><span className="absolute inset-x-0 bottom-0 bg-brand-green-dark/80 p-1 text-center text-[9px] text-brand-ivory">Ready to upload</span></div>)}</div>}</div>
        <div className="flex gap-3 pt-2">{editingId && <Button type="button" variant="outline" className="w-1/2 justify-center" onClick={resetEditor} disabled={busy}>Cancel</Button>}<Button type="submit" variant="primary" className={`justify-center ${editingId ? 'w-1/2' : 'w-full'}`} disabled={busy}>{busy ? 'Saving…' : 'Save Service'}</Button></div>
      </form></GlassCard></div>
      <div className="lg:col-span-7 space-y-6"><h3 className="font-serif text-xl text-brand-green-dark font-bold">Active Offerings</h3>{isLoading ? <p>Loading services…</p> : !services?.length ? <p>No service offerings created yet.</p> : <div className="space-y-4">{services.map((service) => <div key={service.id} className="p-5 rounded border border-brand-gold/15 bg-brand-ivory flex items-center justify-between gap-6 shadow-sm"><div><span className="text-[9px] bg-brand-beige text-brand-green-dark font-bold uppercase tracking-wider px-2 py-0.5 rounded">{service.category}</span><h4 className="font-serif text-lg text-brand-green font-bold mt-1.5">{service.title}</h4><p className="text-[10px] text-brand-charcoal/50 font-mono">ID: {service.id} · {service.portfolioExamples?.length || 0} images</p></div><div className="flex gap-3"><button onClick={() => edit(service)} className="p-2 rounded bg-brand-beige/35 text-brand-green" title="Edit Service"><Edit className="w-4 h-4" /></button><button onClick={() => void deleteService.mutateAsync(service.id)} className="p-2 rounded bg-red-50 text-red-600" title="Delete Service"><Trash2 className="w-4 h-4" /></button></div></div>)}</div>}</div>
    </div></div>;
};
export default ManageServices;
