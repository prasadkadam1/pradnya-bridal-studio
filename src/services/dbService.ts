import { db, isFirebaseConfigured } from "../config/firebase";
import { DEFAULT_SETTINGS } from "../data/firestoreSeedData";
import { mockDb } from "../utils/mockDb";
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
} from "../types/studio";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

const requireFirestore = () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error(
      "Firebase is not configured. Add the VITE_FIREBASE_* environment variables to load live data.",
    );
  }

  return db;
};

type FirestoreDocument<T> = T & { id: string };
type FirestoreCreateInput<T> = Omit<T, "id" | "createdAt">;
const withId = <T extends object>(data: T, id: string): T & { id: string } => ({
  ...data,
  id,
});

export const dbService = {
  // SERVICES
  getServices: async (): Promise<Service[]> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getServices();
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "services");
    const snap = await getDocs(colRef);
    return snap.docs.map(
      (document) =>
        withId(document.data() as Omit<Service, "id">, document.id) as Service,
    ) as Service[];
  },

  getService: async (id: string): Promise<Service | null> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getService(id);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "services", id);
    const snap = await getDoc(docRef);
    return snap.exists()
      ? (withId(snap.data() as Omit<Service, "id">, snap.id) as Service)
      : null;
  },

  updateService: async (
    id: string,
    data: Omit<Partial<Service>, "id">,
  ): Promise<FirestoreDocument<Omit<Partial<Service>, "id">>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateService(id, data);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "services", id);
    await setDoc(docRef, data, { merge: true });
    return withId(data, id);
  },

  deleteService: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.deleteService(id);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "services", id);
    await deleteDoc(docRef);
    return true;
  },

  // PORTFOLIO
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getPortfolio();
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "portfolio");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(
      (document) =>
        withId(
          document.data() as Omit<PortfolioItem, "id">,
          document.id,
        ) as PortfolioItem,
    );
  },

  addPortfolioItem: async (
    item: FirestoreCreateInput<PortfolioItem>,
  ): Promise<FirestoreDocument<PortfolioItem>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.addPortfolioItem(item);
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "portfolio");
    const createdAt = new Date().toISOString();
    const docRef = await addDoc(colRef, { ...item, createdAt });
    return withId(
      { ...item, createdAt },
      docRef.id,
    ) as FirestoreDocument<PortfolioItem>;
  },

  deletePortfolioItem: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.deletePortfolioItem(id);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "portfolio", id);
    await deleteDoc(docRef);
    return true;
  },

  updatePortfolioItem: async (id: string, data: Partial<Omit<PortfolioItem, 'id' | 'createdAt'>>): Promise<{ id: string } & Partial<PortfolioItem>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updatePortfolioItem(id, data);
    }
    const firestore = requireFirestore();
    await updateDoc(doc(firestore, 'portfolio', id), data);
    return { id, ...data };
  },

  // TESTIMONIALS
  getTestimonials: async (): Promise<Testimonial[]> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getTestimonials();
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "testimonials");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(
      (document) =>
        withId(
          document.data() as Omit<Testimonial, "id">,
          document.id,
        ) as Testimonial,
    );
  },

  getPublicTestimonials: async (): Promise<Testimonial[]> => {
    if (!isFirebaseConfigured || !db) {
      return (await mockDb.getTestimonials())
        .filter((item) => item.status === 'approved' || item.status === undefined);
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, 'testimonials');
    // Keep this query compatible with Firestore's built-in single-field index.
    const snap = await getDocs(query(colRef, where('status', '==', 'approved')));
    return snap.docs
      .map((document) => withId(document.data() as Omit<Testimonial, 'id'>, document.id) as Testimonial)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  addTestimonial: async (
    item: FirestoreCreateInput<Testimonial>,
  ): Promise<FirestoreDocument<Testimonial>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.addTestimonial(item);
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "testimonials");
    const createdAt = new Date().toISOString();
    const docRef = await addDoc(colRef, { ...item, createdAt });
    return withId(
      { ...item, createdAt },
      docRef.id,
    ) as FirestoreDocument<Testimonial>;
  },

  updateTestimonialStatus: async (
    id: string,
    status: 'pending' | 'approved' | 'rejected',
  ): Promise<{ id: string; status: 'pending' | 'approved' | 'rejected' }> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateTestimonialStatus(id, status);
    }
    const firestore = requireFirestore();
    await updateDoc(doc(firestore, 'testimonials', id), { status });
    return { id, status };
  },

  deleteTestimonial: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.deleteTestimonial(id);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "testimonials", id);
    await deleteDoc(docRef);
    return true;
  },

  // BLOGS
  getBlogs: async (): Promise<BlogPost[]> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getBlogs();
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "blogs");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(
      (document) =>
        withId(
          document.data() as Omit<BlogPost, "id">,
          document.id,
        ) as BlogPost,
    );
  },

  getBlog: async (slug: string): Promise<BlogPost | null> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getBlog(slug);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "blogs", slug);
    const snap = await getDoc(docRef);
    return snap.exists()
      ? (withId(snap.data() as Omit<BlogPost, "id">, snap.id) as BlogPost)
      : null;
  },

  addBlog: async (
    blog: Omit<BlogPost, "createdAt">,
  ): Promise<FirestoreDocument<BlogPost>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.addBlog(blog);
    }
    const data: BlogPost = { ...blog, createdAt: new Date().toISOString() };
    const firestore = requireFirestore();
    // We use the slug as the document ID for SEO friendly URLs
    const docRef = doc(firestore, "blogs", blog.id);
    await setDoc(docRef, data);
    return withId(data, blog.id) as FirestoreDocument<BlogPost>;
  },

  updateBlog: async (
    id: string,
    data: Omit<Partial<BlogPost>, "id">,
  ): Promise<FirestoreDocument<Omit<Partial<BlogPost>, "id">>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateBlog(id, data);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "blogs", id);
    await updateDoc(docRef, data);
    return withId(data, id);
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.deleteBlog(id);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "blogs", id);
    await deleteDoc(docRef);
    return true;
  },

  // INQUIRIES
  getInquiries: async (): Promise<Inquiry[]> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getInquiries();
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "inquiries");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(
      (document) =>
        withId(document.data() as Omit<Inquiry, "id">, document.id) as Inquiry,
    );
  },

  addInquiry: async (
    inquiry: Omit<Inquiry, "id" | "createdAt" | "status">,
  ): Promise<FirestoreDocument<Inquiry>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.addInquiry(inquiry);
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "inquiries");
    const createdAt = new Date().toISOString();
    const docRef = await addDoc(colRef, {
      ...inquiry,
      status: "new",
      createdAt,
    });
    const data = {
      ...inquiry,
      status: "new",
      createdAt,
    } as Inquiry;
    return withId(data, docRef.id) as FirestoreDocument<Inquiry>;
  },

  updateInquiryStatus: async (
    id: string,
    status: string,
  ): Promise<{ id: string; status: InquiryStatus }> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateInquiryStatus(id, status);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "inquiries", id);
    await updateDoc(docRef, { status: status as InquiryStatus });
    return { id, status: status as InquiryStatus };
  },

  updateInquiryFollowUp: async (
    id: string,
    data: Pick<
      Inquiry,
      | "nextFollowUpDate"
      | "reminderNotes"
      | "internalNotes"
      | "preferredContactChannel"
      | "lastContactedAt"
      | "lastContactMessage"
    >,
  ): Promise<{ id: string } & Partial<Inquiry>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateInquiryFollowUp(id, data);
    }

    const firestore = requireFirestore();
    const docRef = doc(firestore, "inquiries", id);
    await updateDoc(docRef, data);
    return { id, ...data };
  },

  deleteInquiry: async (id: string): Promise<boolean> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.deleteInquiry(id);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "inquiries", id);
    await deleteDoc(docRef);
    return true;
  },

  // AVAILABILITY
  getAvailability: async (): Promise<AvailabilityEntry[]> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getAvailability();
    }
    const firestore = requireFirestore();
    const colRef = collection(firestore, "availability");
    const snap = await getDocs(colRef);
    return snap.docs.map(
      (document) =>
        ({
          ...(document.data() as Omit<AvailabilityEntry, "date">),
          date: document.id,
        }) as AvailabilityEntry,
    );
  },

  updateAvailability: async (
    date: string,
    status: string,
    notes?: string,
  ): Promise<AvailabilityEntry> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateAvailability(date, status, notes);
    }
    const data: AvailabilityEntry = {
      date,
      status: status as AvailabilityStatus,
      notes,
      updatedAt: new Date().toISOString(),
    };
    const firestore = requireFirestore();
    const docRef = doc(firestore, "availability", date);
    await setDoc(docRef, data, { merge: true });
    return data;
  },

  // SETTINGS
  getSettings: async (): Promise<StudioSettings> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.getSettings();
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "settings", "studio-config");
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as StudioSettings) : DEFAULT_SETTINGS;
  },

  updateSettings: async (
    data: Partial<StudioSettings>,
  ): Promise<Partial<StudioSettings>> => {
    if (!isFirebaseConfigured || !db) {
      return mockDb.updateSettings(data);
    }
    const firestore = requireFirestore();
    const docRef = doc(firestore, "settings", "studio-config");
    await setDoc(docRef, data, { merge: true });
    return data;
  },
};
