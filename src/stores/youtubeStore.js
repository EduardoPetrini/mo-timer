import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { db } from '../config/firebase';

const TABLE_NAME = 'yt_videos';
export const useYoutubeStore = defineStore('youtube', () => {
  const getYoutubePlaylist = async () => {
    const colRef = collection(db, TABLE_NAME);
    const savedPlaylists = await getDocs(colRef);
    const videoIds = [];
    savedPlaylists.forEach(doc => {
      const data = doc.data();
      if (data.deleted) {
        return;
      }
      videoIds.push({ vd: data.vd, id: doc.id });
    });

    return videoIds;
  };

  const addYoutubePlaylist = async videoId => {
    const colRef = collection(db, TABLE_NAME);
    const video = { vd: videoId };

    const result = await addDoc(colRef, video);
    return result;
  };

  const deleteYoutubePlaylist = async video => {
    const colRef = collection(db, TABLE_NAME);
    const { id, ...data } = video;
    const docRef = doc(colRef, id);

    const result = await setDoc(docRef, { ...data, deleted: true });

    return result;
  };

  return { getYoutubePlaylist, addYoutubePlaylist, deleteYoutubePlaylist };
});
