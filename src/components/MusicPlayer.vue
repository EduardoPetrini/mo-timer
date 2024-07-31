<script setup>
import { watchEffect, ref, onMounted } from 'vue';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { storeGet, storeSet } from '../utils/storage';

const props = defineProps(['isPlaying']);
const showButton = ref(false);
const playListIds = [];
const currentPlayList = ref();
const previousIndex = ref(0);

onMounted(async () => {
  const savedPlaylists = await getDocs(collection(db, 'playlist'));
  savedPlaylists.forEach(doc => {
    playListIds.push(doc.data().pl);
  });
  currentPlayList.value = playListIds[0];

  window.onSpotifyIframeApiReady = IFrameAPI => {
    let plIndex = storeGet('pl-index');
    if (!plIndex) {
      plIndex = 0;
    }
    currentPlayList.value = playListIds[plIndex];

    let element = document.getElementById('embed-iframe');
    let options = {
      uri: 'spotify:playlist:' + currentPlayList.value,
      height: 100,
      theme: 'dark',
    };
    let callback = EmbedController => {
      audioController = EmbedController;
      setTimeout(() => {
        showButton.value = true;
      }, 1000);
    };

    IFrameAPI.createController(element, options, callback);
  };
});

let audioController;

watchEffect(() => {
  if (props.isPlaying && audioController) {
    audioController.resume();
  }

  if (!props.isPlaying && audioController) {
    audioController.pause();
  }
});

function randomPlaylist() {
  audioController.pause();

  previousIndex.value++;

  if (previousIndex.value === playListIds.length) {
    previousIndex.value = 0;
  }
  storeSet('pl-index', `${previousIndex.value}`);
  setPlaylist(previousIndex.value);
}

function setPlaylist(index) {
  const newPlaylist = playListIds[index];

  audioController.loadUri('spotify:playlist:' + newPlaylist);
}
</script>

<template>
  <div class="mt-10 container">
    <iframe id="embed-iframe"></iframe>
    <button v-show="showButton" class="btn text-gray-200 float-right" @click="randomPlaylist" title="Click to select another random playlist" atl="click to select another random playlist">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
        />
      </svg>
    </button>
  </div>
</template>
