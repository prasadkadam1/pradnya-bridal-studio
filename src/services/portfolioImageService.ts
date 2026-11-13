import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, isFirebaseConfigured, storage } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { dbService } from './dbService';

const MAX_SOURCE_BYTES = 15 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 2000;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const validatePortfolioImage = (file: File) => {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Each original image must be 15 MB or smaller.');
  }
};

const safeSegment = (value: string) => value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

export const optimizePortfolioImage = async (file: File): Promise<File> => {
  validatePortfolioImage(file);

  const source = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image optimization failed.')), 'image/webp', 0.88);
  });

  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error('This image is still too large after optimization. Please choose a smaller photo.');
  }

  return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'portfolio-image'}.webp`, { type: 'image/webp' });
};

export const uploadPortfolioImage = async (
  file: File,
  serviceId: string,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  if (!serviceId) throw new Error('Select a service before uploading images.');
  const optimized = await optimizePortfolioImage(file);

  if (!isFirebaseConfigured || !storage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Could not read the image in local mode.'));
      reader.readAsDataURL(optimized);
    });
  }

  if (!auth?.currentUser) {
    throw new Error('Your admin session has expired. Please sign in again before uploading images.');
  }

  const currentUser = auth.currentUser;
  // Refresh the Firebase Auth token before Storage creates its resumable-upload request.
  // This is deliberately separate from the route guard: Storage Rules evaluate this token.
  await currentUser.getIdToken();

  if (!db) {
    throw new Error('Firestore is unavailable. Please reload and sign in again before uploading images.');
  }

  const adminSnapshot = await getDoc(doc(db, 'users', currentUser.uid));
  if (!adminSnapshot.exists() || adminSnapshot.data()?.role !== 'admin') {
    throw new Error('This account is not authorized to upload portfolio images.');
  }

  const filename = `${Date.now()}-${crypto.randomUUID()}.webp`;
  const path = `portfolio/${safeSegment(serviceId)}/${filename}`;
  if (import.meta.env.DEV) {
    console.info('Portfolio upload diagnostics', {
      projectId: storage.app.options.projectId,
      bucket: storage.app.options.storageBucket,
      path,
      isAuthenticated: true,
      uid: currentUser.uid,
      email: currentUser.email,
      contentType: optimized.type,
      size: optimized.size,
    });
  }
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, optimized, { contentType: 'image/webp' });

  return new Promise((resolve, reject) => {
    task.on('state_changed', (snapshot) => {
      onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
    }, reject, async () => {
      try {
        resolve(await getDownloadURL(task.snapshot.ref));
      } catch (error) {
        reject(error);
      }
    });
  });
};

const isManagedPortfolioUrl = (url: string) =>
  url.includes('/o/portfolio%2F') || url.includes('/o/portfolio/');

export const deletePortfolioImageIfUnreferenced = async (url: string, serviceId: string) => {
  if (!isFirebaseConfigured || !storage || !isManagedPortfolioUrl(url)) return;

  const [services, portfolio] = await Promise.all([dbService.getServices(), dbService.getPortfolio()]);
  const usedByAnotherService = services.some((service) =>
    service.id !== serviceId && service.portfolioExamples?.includes(url),
  );
  const usedByPortfolio = portfolio.some((item) => item.imageUrl === url);
  if (!usedByAnotherService && !usedByPortfolio) {
    await deleteObject(ref(storage, url));
  }
};
