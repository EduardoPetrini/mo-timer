<script setup>
import { watchEffect, ref } from 'vue';

const props = defineProps(['isPlaying']);
const showButton = ref(false);
const playListIds = ['6sGPclX1FuHmWjn6yJemng', '4avuiL7lthpPIndh7lYWqH', '37i9dQZF1DWWQRwui0ExPn', '5bWjbsAqxaTTDxxwbVGJwH', '4eWBwGl0c5wtp6k5Krp6My', '5z9CdKSqJjAt30rhTlRDZX', '2Al9G2jrWkwDlRFMZaw1GX'];

const currentPlayList = ref(playListIds[0]);

let audioController;

window.onSpotifyIframeApiReady = IFrameAPI => {
  let element = document.getElementById('embed-iframe');
  let options = {
    uri: 'spotify:playlist:' + currentPlayList.value,
    height: 200,
    theme: 'dark',
  };
  let callback = EmbedController => {
    audioController = EmbedController;
    setTimeout(() => {

      showButton.value = true;
    }, 1000)
  };

  IFrameAPI.createController(element, options, callback);
};

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

  const randomIndex = Math.floor(Math.random() * playListIds.length);

  const newPlaylist = playListIds[randomIndex];

  audioController.loadUri('spotify:playlist:' + newPlaylist);
}
</script>

<template>
  <div class="mt-10 absolute bottom-10">
    <iframe id="embed-iframe"></iframe>
    <button v-show="showButton" class="btn absolute top-40 right-0 text-gray-200" @click="randomPlaylist" title="Click to select another random playlist" atl="click to select another random playlist">
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
