import { useState } from 'react';
import { storage, isFirebaseConfigured } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const useStorage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const uploadFile = async (file: File, folder = 'portfolio'): Promise<string> => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setUrl(null);

    if (isFirebaseConfigured && storage) {
      return new Promise((resolve, reject) => {
        const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage!, `${folder}/${uniqueFileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(p));
          },
          (err) => {
            console.error("Storage upload error:", err);
            setError(err.message);
            setUploading(false);
            reject(err);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              setUrl(downloadUrl);
              setUploading(false);
              resolve(downloadUrl);
            } catch (error: unknown) {
              const message = error instanceof Error ? error.message : 'Error obtaining download URL';
              console.error('Error obtaining download URL:', error);
              setError(message);
              setUploading(false);
              reject(error instanceof Error ? error : new Error(message));
            }
          }
        );
      });
    } else {
      // Mock Mode: simulate upload speed and return base64 string
      return new Promise((resolve, reject) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += 25;
          setProgress(currentProgress);
          
          if (currentProgress >= 100) {
            clearInterval(interval);
            
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Url = reader.result as string;
              setUrl(base64Url);
              setUploading(false);
              resolve(base64Url);
            };
            reader.onerror = () => {
              setError("Failed to read file in mock mode");
              setUploading(false);
              reject(new Error("Failed to read file"));
            };
            reader.readAsDataURL(file);
          }
        }, 150);
      });
    }
  };

  return { uploadFile, progress, error, url, uploading };
};
