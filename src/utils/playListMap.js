// import createModule from 'spotify-url-info';

export const plMap = {
  youtube: {
    field: 'vd',
    url: 'https://www.youtube.com/watch?v=',
    getPlayListName: async playListId => {
      const apiUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${playListId}&format=json`;
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        console.log('youtube:', data);
        return data.title;
      } else {
        return 'Could not fetch title';
      }
    },
  },
  spotify: {
    field: 'pl',
    url: 'https://open.spotify.com/playlist/',
    getPlayListName2: async playListId => {
      // const api = createModule(fetch);

      // const response = await api.getData(`https://open.spotify.com/playlist/${playListId}`, { mode: 'no-cors' });
      // debugger;
      // console.log('Spotify:', response);
      // return response.title;
    },
    getPlayListName: async playListId => {
      const url = `https://cors-anywhere.herokuapp.com/https://embed.spotify.com/?uri=spotify:playlist:${playListId}`;

      const response = await fetch(url);
      const data = await response.text();
      debugger;
      console.log('Spotify:', data);
      return response.title;
    },
  },
};
