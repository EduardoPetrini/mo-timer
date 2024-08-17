<script setup>
import { ref } from 'vue';
import SpotifyPlayer from './SpotifyPlayer.vue';
import YoutubePlayer from './YoutubePlayer.vue';
import { storeGet, storeSet } from '../utils/storage';

const props = defineProps(['isPlaying']);

const currentPlayer = ref('spotify');
const options = ref(['youtube', 'spotify']);

let savedPlayer = storeGet('currentPlayer');
if (savedPlayer) {
  currentPlayer.value = savedPlayer;
}

function playerChanged() {
  storeSet('currentPlayer', currentPlayer.value)
}
</script>

<template>
  <div class="mt-10 relative h-min-100">
    <div class="absolute z-50">
      <select name="player" id="idPlayer" v-model="currentPlayer" class="btn-select" @change="playerChanged">
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <div class="fixed">
      <div v-if="currentPlayer === 'youtube'">
        <YoutubePlayer :isPlaying="props.isPlaying" />
      </div>
      <div v-else>
        <SpotifyPlayer :isPlaying="props.isPlaying" />
      </div>
    </div>
  </div>
</template>
