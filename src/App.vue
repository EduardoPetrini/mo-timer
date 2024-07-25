<script setup>
import { ref } from 'vue';
import TimerCounter from './components/TimerCounter.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import FullScreen from './components/FullScreen.vue';

const isPlaying = ref(false);

function playEvent(play) {
  isPlaying.value = play;
}
</script>

<template>
  <div class="p-2 h-screen flex justify-center items-center bg-black" style="background-image: url('/wave-pattern.svg')">
    <TimerCounter @play="playEvent" />
    <MusicPlayer :isPlaying="isPlaying"/>
    <FullScreen  />
  </div>
</template>

