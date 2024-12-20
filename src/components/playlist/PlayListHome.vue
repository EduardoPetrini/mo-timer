<script setup>
import Delete from '../icons/Delete.vue';
import Link from '../icons/Link.vue';
import { onMounted, ref } from 'vue';
import { storeGet } from '../../utils/storage';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { storeMap } from '../../stores/playerStoresMap';
import { plMap } from '../../utils/playListMap';

const auth = getAuth();
const router = useRouter();

const isToAdd = ref(false);
const newPlaylist = ref('');
const errorMessage = ref('');

const currentPlayer = ref('spotify');

let savedPlayer = storeGet('currentPlayer');
if (savedPlayer) {
  currentPlayer.value = savedPlayer;
}

let playerStore = storeMap[currentPlayer.value]();

const options = ref(['youtube', 'spotify']);
const fieldName = ref(plMap[currentPlayer.value ?? 'spotify'].field);

const currentList = ref([]);

async function deletePl(playlist) {
  await playerStore.deletePlaylist(playlist);
  currentList.value = await playerStore.getPlaylist();
}

async function playerChanged() {
  newPlaylist.value = '';
  errorMessage.value = '';

  playerStore = storeMap[currentPlayer.value]();
  currentList.value = await playerStore.getPlaylist();

  switch (currentPlayer.value) {
    case 'youtube': {
      fieldName.value = plMap.youtube.field;
      break;
    }
    case 'spotify': {
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

  try {
    await playerStore.addPlaylist(newPlaylist.value);
    currentList.value = await playerStore.getPlaylist();

    isToAdd.value = false;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.message;
  }
}

function cancelSave() {
  errorMessage.value = '';
  isToAdd.value = false;
}

onMounted(async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      return;
    }
    router.push('/');
  });

  await playerChanged();
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
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Playlist</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="playlist in currentList" :key="playlist.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">
              <a :href="plMap[currentPlayer].url + playlist[fieldName]" target="_blank" class="flex gap-2">{{ playlist[fieldName] }} </a>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div v-if="currentPlayer === 'youtube'">
                <iframe style="border-radius: 12px" width="100%" height="80" :src="'https://www.youtube.com/embed/' + playlist[fieldName]"  frameborder="0"></iframe>
              </div>
              <div v-else>
                <iframe style="border-radius: 12px" width="100%" height="80" :src="'https://open.spotify.com/embed/playlist/' + playlist[fieldName]" frameBorder="0"></iframe>
              </div>
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
