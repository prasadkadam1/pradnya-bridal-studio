import {
  DEFAULT_AVAILABILITY,
  DEFAULT_BLOGS,
  DEFAULT_INQUIRIES,
  DEFAULT_PORTFOLIO,
  DEFAULT_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
} from '../data/firestoreSeedData';
import type {
  AvailabilityEntry,
  AvailabilityStatus,
  BlogPost,
  Inquiry,
  InquiryStatus,
  PortfolioItem,
  Service,
  StudioSettings,
  Testimonial,
} from '../types/studio';

type CollectionName =
  | 'services'
  | 'portfolio'
  | 'testimonials'
  | 'blogs'
  | 'inquiries'
  | 'availability';

type MockCollections = {
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
  blogs: BlogPost[];
  inquiries: Inquiry[];
  availability: AvailabilityEntry[];
};

const STORAGE_KEY = 'pradnya_mock_db_v1';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createFallbackId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

const createInitialState = (): MockCollections => ({
  services: clone(DEFAULT_SERVICES),
  portfolio: DEFAULT_PORTFOLIO.map((item) => ({
    ...item,
    category: item.category as PortfolioItem['category'],
  })),
  testimonials: clone(DEFAULT_TESTIMONIALS),
  blogs: clone(DEFAULT_BLOGS),
  inquiries: clone(DEFAULT_INQUIRIES),
  availability: clone(DEFAULT_AVAILABILITY),
});

const readState = (): MockCollections => {
  if (typeof window === 'undefined') {
    return createInitialState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initialState = createInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    return JSON.parse(raw) as MockCollections;
  } catch {
    const initialState = createInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }
};

const writeState = (state: MockCollections) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

const sortByNewest = <T extends { createdAt?: string }>(items: T[]) =>
  [...items].sort((left, right) => (right.createdAt || '').localeCompare(left.createdAt || ''));

const upsertById = <T extends { id: string }>(items: T[], item: T) =>
  items.some((existing) => existing.id === item.id)
    ? items.map((existing) => (existing.id === item.id ? item : existing))
    : [item, ...items];

const removeById = <T extends { id: string }>(items: T[], id: string) =>
  items.filter((item) => item.id !== id);

const setCollection = <T extends CollectionName>(
  state: MockCollections,
  collectionName: T,
  items: MockCollections[T]
) => {
  state[collectionName] = items;
};

export const mockDb = {
  getServices: async () => clone(readState().services),
  getService: async (id: string) => readState().services.find((service) => service.id === id) || null,
  updateService: async (id: string, data: Partial<Service>) => {
    const state = readState();
    const nextService = { ...(state.services.find((service) => service.id === id) || { id }), ...data, id } as Service;
    setCollection(state, 'services', upsertById(state.services, nextService));
    writeState(state);
    return nextService;
  },
  deleteService: async (id: string) => {
    const state = readState();
    setCollection(state, 'services', removeById(state.services, id));
    writeState(state);
    return true;
  },

  getPortfolio: async () => sortByNewest(clone(readState().portfolio)),
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    const state = readState();
    const nextItem: PortfolioItem = {
      ...item,
      id: createFallbackId(),
      createdAt: new Date().toISOString(),
    };
    setCollection(state, 'portfolio', [nextItem, ...state.portfolio]);
    writeState(state);
    return nextItem;
  },
  deletePortfolioItem: async (id: string) => {
    const state = readState();
    setCollection(state, 'portfolio', removeById(state.portfolio, id));
    writeState(state);
    return true;
  },
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>) => {
    const state = readState();
    const current = state.portfolio.find((item) => item.id === id);
    if (!current) throw new Error('Portfolio item not found.');
    const nextItem = { ...current, ...data, id } as PortfolioItem;
    setCollection(state, 'portfolio', upsertById(state.portfolio, nextItem));
    writeState(state);
    return nextItem;
  },

  getTestimonials: async () => sortByNewest(clone(readState().testimonials)),
  updateTestimonialStatus: async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const state = readState();
    const current = state.testimonials.find((item) => item.id === id);
    if (!current) throw new Error('Review not found.');
    const next = { ...current, status };
    setCollection(state, 'testimonials', upsertById(state.testimonials, next));
    writeState(state);
    return { id, status };
  },
  addTestimonial: async (item: Omit<Testimonial, 'id' | 'createdAt'>) => {
    const state = readState();
    const nextItem: Testimonial = {
      ...item,
      id: createFallbackId(),
      createdAt: new Date().toISOString(),
    };
    setCollection(state, 'testimonials', [nextItem, ...state.testimonials]);
    writeState(state);
    return nextItem;
  },
  deleteTestimonial: async (id: string) => {
    const state = readState();
    setCollection(state, 'testimonials', removeById(state.testimonials, id));
    writeState(state);
    return true;
  },

  getBlogs: async () => sortByNewest(clone(readState().blogs)),
  getBlog: async (slug: string) => readState().blogs.find((blog) => blog.id === slug) || null,
  addBlog: async (blog: Omit<BlogPost, 'createdAt'>) => {
    const state = readState();
    const nextBlog: BlogPost = { ...blog, createdAt: new Date().toISOString() };
    setCollection(state, 'blogs', upsertById(state.blogs, nextBlog));
    writeState(state);
    return nextBlog;
  },
  updateBlog: async (id: string, data: Partial<BlogPost>) => {
    const state = readState();
    const nextBlog = { ...(state.blogs.find((blog) => blog.id === id) || { id }), ...data, id } as BlogPost;
    setCollection(state, 'blogs', upsertById(state.blogs, nextBlog));
    writeState(state);
    return nextBlog;
  },
  deleteBlog: async (id: string) => {
    const state = readState();
    setCollection(state, 'blogs', removeById(state.blogs, id));
    writeState(state);
    return true;
  },

  getInquiries: async () => sortByNewest(clone(readState().inquiries)),
  addInquiry: async (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const state = readState();
    const nextInquiry: Inquiry = {
      ...inquiry,
      id: createFallbackId(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setCollection(state, 'inquiries', [nextInquiry, ...state.inquiries]);
    writeState(state);
    return nextInquiry;
  },
  updateInquiryStatus: async (id: string, status: string) => {
    const state = readState();
    const nextStatus = status as InquiryStatus;
    setCollection(
      state,
      'inquiries',
      state.inquiries.map((inquiry) => (inquiry.id === id ? { ...inquiry, status: nextStatus } : inquiry))
    );
    writeState(state);
    return { id, status: nextStatus };
  },
  updateInquiryFollowUp: async (
    id: string,
    data: Pick<
      Inquiry,
      | 'nextFollowUpDate'
      | 'reminderNotes'
      | 'internalNotes'
      | 'preferredContactChannel'
      | 'lastContactedAt'
      | 'lastContactMessage'
    >
  ) => {
    const state = readState();
    setCollection(
      state,
      'inquiries',
      state.inquiries.map((inquiry) => (inquiry.id === id ? { ...inquiry, ...data } : inquiry))
    );
    writeState(state);
    return { id, ...data };
  },
  deleteInquiry: async (id: string) => {
    const state = readState();
    setCollection(state, 'inquiries', removeById(state.inquiries, id));
    writeState(state);
    return true;
  },

  getAvailability: async () => clone(readState().availability),
  updateAvailability: async (date: string, status: string, notes?: string) => {
    const state = readState();
    const nextAvailability: AvailabilityEntry = {
      date,
      status: status as AvailabilityStatus,
      notes,
      updatedAt: new Date().toISOString(),
    };
    setCollection(
      state,
      'availability',
      state.availability.some((entry) => entry.date === date)
        ? state.availability.map((entry) => (entry.date === date ? nextAvailability : entry))
        : [nextAvailability, ...state.availability]
    );
    writeState(state);
    return nextAvailability;
  },

  getSettings: async () => {
    if (typeof window === 'undefined') {
      return clone(DEFAULT_SETTINGS);
    }

    const raw = window.localStorage.getItem(`${STORAGE_KEY}_settings`);
    if (!raw) {
      return clone(DEFAULT_SETTINGS);
    }

    try {
      return JSON.parse(raw) as StudioSettings;
    } catch {
      return clone(DEFAULT_SETTINGS);
    }
  },
  updateSettings: async (data: Partial<StudioSettings>) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(data));
    }
    return data;
  },

  seed: async () => {
    const state = createInitialState();
    writeState(state);
    return state;
  },
};
