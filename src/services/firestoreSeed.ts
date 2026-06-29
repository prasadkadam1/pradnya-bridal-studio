import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import {
  DEFAULT_AVAILABILITY,
  DEFAULT_BLOGS,
  DEFAULT_INQUIRIES,
  DEFAULT_PORTFOLIO,
  DEFAULT_SETTINGS,
  DEFAULT_SERVICES,
  DEFAULT_TESTIMONIALS,
} from '../data/firestoreSeedData';

const SETTINGS_DOC_ID = 'studio-config';

const requireFirestore = () => {
  if (!db) {
    throw new Error('Firestore is not available.');
  }

  return db;
};

const seedCollectionIfEmpty = async (
  collectionName: string,
  documents: Array<{ id: string; [key: string]: unknown }>
) => {
  const firestore = requireFirestore();

  const collectionRef = collection(firestore, collectionName);
  const snapshot = await getDocs(collectionRef);

  if (!snapshot.empty) {
    return { collectionName, seeded: false, count: snapshot.size };
  }

  const batch = writeBatch(firestore);

  documents.forEach((document) => {
    const { id, ...data } = document;
    batch.set(doc(firestore, collectionName, id), data);
  });

  await batch.commit();
  return { collectionName, seeded: true, count: documents.length };
};

export const seedStudioContent = async () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* env values first.');
  }

  const firestore = requireFirestore();
  const results = [];

  results.push(
    await seedCollectionIfEmpty('services', DEFAULT_SERVICES.map((item) => ({ ...item })))
  );
  results.push(
    await seedCollectionIfEmpty('portfolio', DEFAULT_PORTFOLIO.map((item) => ({ ...item })))
  );
  results.push(
    await seedCollectionIfEmpty('testimonials', DEFAULT_TESTIMONIALS.map((item) => ({ ...item })))
  );
  results.push(await seedCollectionIfEmpty('blogs', DEFAULT_BLOGS.map((item) => ({ ...item }))));
  results.push(
    await seedCollectionIfEmpty('inquiries', DEFAULT_INQUIRIES.map((item) => ({ ...item })))
  );
  results.push(
    await seedCollectionIfEmpty(
      'availability',
      DEFAULT_AVAILABILITY.map((item) => ({ id: item.date, ...item }))
    )
  );

  const settingsSnapshot = await getDocs(collection(firestore, 'settings'));
  if (settingsSnapshot.empty) {
    const batch = writeBatch(firestore);
    batch.set(doc(firestore, 'settings', SETTINGS_DOC_ID), DEFAULT_SETTINGS);
    await batch.commit();
    results.push({ collectionName: 'settings', seeded: true, count: 1 });
  } else {
    results.push({ collectionName: 'settings', seeded: false, count: settingsSnapshot.size });
  }

  return results;
};
