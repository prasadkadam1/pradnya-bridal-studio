import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/dbService';
import type { BlogPost, Inquiry, PortfolioItem, Service } from '../types/studio';

// SERVICES
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: dbService.getServices
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => dbService.getService(id),
    enabled: !!id
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => dbService.updateService(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services', data.id] });
    }
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });
};

// PORTFOLIO
export const usePortfolio = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: dbService.getPortfolio
  });
};

export const useAddPortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.addPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.deletePortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PortfolioItem> }) => dbService.updatePortfolioItem(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portfolio'] }),
  });
};

// TESTIMONIALS
export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: dbService.getTestimonials
  });
};

export const usePublicTestimonials = () => {
  return useQuery({
    queryKey: ['public-testimonials'],
    queryFn: dbService.getPublicTestimonials
  });
};

export const useAddTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.addTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['public-testimonials'] });
    }
  });
};

export const useUpdateTestimonialStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'approved' | 'rejected' }) =>
      dbService.updateTestimonialStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['public-testimonials'] });
    }
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['public-testimonials'] });
    }
  });
};

// BLOGS
export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: dbService.getBlogs
  });
};

export const useBlog = (slug: string) => {
  return useQuery({
    queryKey: ['blogs', slug],
    queryFn: () => dbService.getBlog(slug),
    enabled: !!slug
  });
};

export const useAddBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) => dbService.updateBlog(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs', data.id] });
    }
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  });
};

// INQUIRIES
export const useInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: dbService.getInquiries
  });
};

export const useAddInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.addInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      dbService.updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });
};

export const useUpdateInquiryFollowUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Pick<
        Inquiry,
        | 'nextFollowUpDate'
        | 'reminderNotes'
        | 'internalNotes'
        | 'preferredContactChannel'
        | 'lastContactedAt'
        | 'lastContactMessage'
      >;
    }) => dbService.updateInquiryFollowUp(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.deleteInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });
};

// AVAILABILITY
export const useAvailability = () => {
  return useQuery({
    queryKey: ['availability'],
    queryFn: dbService.getAvailability
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date, status, notes }: { date: string; status: string; notes?: string }) => 
      dbService.updateAvailability(date, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    }
  });
};

// SETTINGS
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: dbService.getSettings
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dbService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });
};
