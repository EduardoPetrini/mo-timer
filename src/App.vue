<script setup>
import { ref } from 'vue';
import TimerCounter from './components/TimerCounter.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import BackgroundImage from './components/BackgroundImage.vue';
import FullScreen from './components/FullScreen.vue';

const isPlaying = ref(false);
const bgImage = ref("url('/wave-pattern.svg')");

function playEvent(play) {
  isPlaying.value = play;
}
</script>

<template>
  <div class="p-2 h-screen flex justify-center items-center bg-black" :style="{ 'background-image': bgImage }">
    <TimerCounter @play="playEvent" />
    <MusicPlayer :isPlaying="isPlaying"/>
    <BackgroundImage />
    <FullScreen  />
  </div>
</template>

