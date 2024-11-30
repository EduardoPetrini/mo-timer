import { useYoutubeStore } from './youtubeStore';
import { useSpotifyStore } from './spotifyStore';

export const storeMap = {
  youtube: useYoutubeStore,
  spotify: useSpotifyStore,
};
