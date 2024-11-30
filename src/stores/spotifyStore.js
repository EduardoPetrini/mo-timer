import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { db } from '../config/firebase';

const TABLE_NAME = 'playlist';
export const useSpotifyStore = defineStore('spotify', () => {
  const getPlaylist = async () => {
    const colRef = collection(db, TABLE_NAME);
    const savedPlaylists = await getDocs(colRef);

    const playListIds = [];
    
    savedPlaylists.forEach(doc => {
     const data = doc.data();
      if (data.deleted) {
        return;
      }
      playListIds.push({ pl:data.pl, id: doc.id });
    });

    return playListIds;
  };

  const addPlaylist = async playListId => {
    const colRef = collection(db, TABLE_NAME);
    const playList = { pl: playListId };

    const result = await addDoc(colRef, playList);
    return result;
  };

  const deletePlaylist = async playList => {
    const colRef = collection(db, TABLE_NAME);
    const { id, ...data } = playList;
    const docRef = doc(colRef, id);

    const result = await setDoc(docRef, { ...data, deleted: true });

    return result;
  };

  return { getPlaylist, addPlaylist, deletePlaylist };
});
