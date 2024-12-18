<script setup>
import { watchEffect, ref, onMounted, watch } from 'vue';
import { storeGet, storeSet } from '../utils/storage';
import { useYoutubeStore } from '../stores/youtubeStore';

const props = defineProps(['isPlaying']);
const youtubeStore = useYoutubeStore();
const showButton = ref(false);
let videosIds = [];
const currentVideo = ref();
const previousIndex = ref(0);

onMounted(async () => {
  const savedVideos = await youtubeStore.getPlaylist();
  videosIds = savedVideos.map(data => data.vd);

  currentVideo.value = videosIds[0];

  if (window.YT?.Player) {
    return window.onYouTubeIframeAPIReady();
  }

  mountYoutubeScriptTag();
});

function mountYoutubeScriptTag() {
  const tag = document.createElement('script');

  tag.src = 'https://www.youtube.com/iframe_api';

  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

let player;
window.onYouTubeIframeAPIReady = () => {
  let ytIndex = storeGet('yt-index');
  if (!ytIndex) {
    ytIndex = 0;
  }

  previousIndex.value = ytIndex;
  currentVideo.value = videosIds[ytIndex] || 'RDjfKfPfyJRdk';

  player = new window.YT.Player('player', {
    height: '100',
    width: '338',
    videoId: currentVideo.value,
    playerVars: {
      playsinline: 1,
      cc_load_policy: 0,
      color: 'dark',
      controls: 1,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      loop: 0,
      rel: 0,
      showinfo: 0,
    },
    events: {
      onReady: onPlayerReady,
    },
  });
};

function onPlayerReady(event) {
  setTimeout(() => {
    showButton.value = true;
  }, 100);
}

function playVideo() {
  player.playVideo();
}

function pauseVideo() {
  player.pauseVideo();
}

function stopVideo() {
  player.stopVideo();
}

function loadVideoId(videoId) {
  player.loadVideoById(videoId);
}

watchEffect(() => {
  if (props.isPlaying && player) {
    playVideo();
  }

  if (!props.isPlaying && player) {
    pauseVideo();
  }
});

function nextVideo() {
  pauseVideo();

  previousIndex.value++;

  if (previousIndex.value === videosIds.length) {
    previousIndex.value = 0;
  }
  storeSet('yt-index', `${previousIndex.value}`);
  setVideo(previousIndex.value);
}

function setVideo(index) {
  const newVideoId = videosIds[index];

  loadVideoId(newVideoId);
}
</script>
<template>
  <div class="mt-10 container">
    <div id="player"></div>
    <button v-show="showButton" class="btn text-gray-200 float-right mt-1" @click="nextVideo" title="Click to select another random playlist" atl="click to select another random playlist">
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
