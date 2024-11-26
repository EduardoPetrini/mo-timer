import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { db } from '../config/firebase';

const TABLE_NAME = 'background';
export const useBackgroundStore = defineStore('background', () => {
  const getWallpapers = async () => {
    const colRef = collection(db, TABLE_NAME);
    const savedPlaylists = await getDocs(colRef);
    const videoIds = [];
    savedPlaylists.forEach(doc => {
      const data = doc.data();
      if (data.deleted) {
        return;
      }
      videoIds.push({ bg: data.bg, id: doc.id });
    });

    return videoIds;
  };

  const addWallpaper = async wallpaperLink => {
    const colRef = collection(db, TABLE_NAME);
    const video = { bg: wallpaperLink };

    const result = await addDoc(colRef, video);
    return result;
  };

  const deleteWallpaper = async wp => {
    const colRef = collection(db, TABLE_NAME);
    const { id, ...data } = wp;
    const docRef = doc(colRef, id);

    const result = await setDoc(docRef, { ...data, deleted: true });

    return result;
  };

  return { getWallpapers, addWallpaper, deleteWallpaper };
});
