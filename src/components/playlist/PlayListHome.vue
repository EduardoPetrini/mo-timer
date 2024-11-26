<script setup>
import Delete from '../icons/Delete.vue';
import Link from '../icons/Link.vue';
import { onMounted, ref } from 'vue';
import { useSpotifyStore } from '../../stores/spotifyStore';
import { useYoutubeStore } from '../../stores/youtubeStore';
import { storeGet } from '../../utils/storage';

const spotifyStore = useSpotifyStore();
const youtubeStore = useYoutubeStore();

const spotifyPlaylists = ref([]);
const youtubePlaylists = ref([]);

const isToAdd = ref(false);
const newPlaylist = ref('');
const errorMessage = ref('');
const plMap = { youtube: { field: 'vd', url: 'https://www.youtube.com/watch?v=' }, spotify: { field: 'pl', url: 'https://open.spotify.com/playlist/' } };

const currentPlayer = ref('spotify');

let savedPlayer = storeGet('currentPlayer');
if (savedPlayer) {
  currentPlayer.value = savedPlayer;
}

const options = ref(['youtube', 'spotify']);
const fieldName = ref(plMap[currentPlayer.value ?? 'spotify'].field);

const currentList = ref([]);

async function deletePl(playlist) {
  switch (currentPlayer.value) {
    case 'youtube': {
      await youtubeStore.deleteYoutubePlaylist(playlist);
      youtubePlaylists.value = await youtubeStore.getYoutubePlaylist();
      currentList.value = youtubePlaylists.value;
      break;
    }
    case 'spotify': {
      await spotifyStore.deleteSpotifyPlaylist(playlist);
      spotifyPlaylists.value = await spotifyStore.getSpotifyPlaylist();
      currentList.value = spotifyPlaylists.value;
      break;
    }
  }
}

function playerChanged() {
  switch (currentPlayer.value) {
    case 'youtube': {
      currentList.value = youtubePlaylists.value;
      fieldName.value = plMap.youtube.field;
      break;
    }
    case 'spotify': {
      currentList.value = spotifyPlaylists.value;
      fieldName.value = plMap.spotify.field;
      break;
    }
  }
}

function addPlaylist() {
  isToAdd.value = !isToAdd.value;
}

async function savePlaylist() {
  errorMessage.value = '';
  if (!newPlaylist.value) {
    errorMessage.value = 'The playlist id is required';
    return;
  }

  newPlaylist.value = newPlaylist.value.replace(plMap[currentPlayer.value].url, '').split(/\?|&/)[0];

  switch (currentPlayer.value) {
    case 'youtube': {
      await youtubeStore.addYoutubePlaylist(newPlaylist.value);
      youtubePlaylists.value = await youtubeStore.getYoutubePlaylist();
      currentList.value = youtubePlaylists.value;
      break;
    }
    case 'spotify': {
      await spotifyStore.addSpotifyPlaylist(newPlaylist.value);
      spotifyPlaylists.value = await spotifyStore.getSpotifyPlaylist();
      currentList.value = spotifyPlaylists.value;
      break;
    }
  }

  isToAdd.value = false;
}

function cancelSave() {
  errorMessage.value = '';
  isToAdd.value = false;
}

onMounted(async () => {
  const [spotifyResolved, youtubeResolved] = await Promise.all([spotifyStore.getSpotifyPlaylist(), youtubeStore.getYoutubePlaylist()]);
  spotifyPlaylists.value = spotifyResolved;
  youtubePlaylists.value = youtubeResolved;

  switch (currentPlayer.value) {
    case 'youtube': {
      currentList.value = youtubePlaylists.value;
      fieldName.value = plMap.youtube.field;
      break;
    }
    case 'spotify': {
      currentList.value = spotifyPlaylists.value;
      fieldName.value = plMap.spotify.field;
      break;
    }
  }
});
</script>

<template>
  <div class="">
    <div class="flex gap-4 mb-2">
      <select name="player" id="idPlayer" v-model="currentPlayer" class="btn-select" @change="playerChanged">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>

      <span class="px-2 bg-gray-600/60 text-gray-300 rounded-md content-center">Total: {{ currentList.length }}</span>
    </div>

    <div class="flex p-4 bg-gray-200/90 max-h-96 overflow-y-scroll">
      <table class="min-w-full h-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 min-w-96">ID</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Playlist</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="playlist in currentList" :key="playlist.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ playlist[fieldName] }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <a :href="plMap[currentPlayer].url + playlist[fieldName]" target="_blank" class="flex gap-2">Link <Link /></a>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <Delete class="cursor-pointer" title="Delete post" @click="deletePl(playlist)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <button class="btn-add mt-2 mb-2" @click="addPlaylist">Add</button>
    </div>
    <div v-show="isToAdd">
      <div class="flex flex-col bg-gray-100 rounded-md">
        <input class="p-2 rounded-md" :placeholder="currentPlayer + ' playlist id: ' + plMap[currentPlayer].url + '<id>'" v-model="newPlaylist" />
      </div>
      <div class="flex justify-between">
        <button class="btn-add mt-2 text-red-400" @click="cancelSave">Cancel</button>
        <button class="btn-add mt-2" @click="savePlaylist">Save</button>
      </div>
      <div>
        <span class="text-red-600">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>
