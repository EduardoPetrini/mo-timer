<script setup>
import { ref } from 'vue';
import TimerCounter from './components/TimerCounter.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import BackgroundImage from './components/BackgroundImage.vue';
import FullScreen from './components/FullScreen.vue';

const isPlaying = ref(false);
const backgroundImageList = [
  { 'background-image': "url('/wave-pattern.svg')" },
  { 'background-image': "url('/feather-surface.jpg')", 'background-size': '100%' },
  { 'background-image': "url('/feather-backdrop.jpg')", 'background-size': '100%' },
  { 'background-image': "url('/gradient-background.avif')", 'background-size': '100%' },
  { 'background-image': "url('/bullseye-gradient.svg')", 'background-size': '100%' },
  { 'background-image': "url('/endless-constellation.svg')" },
  { 'background-image': "url('/slanted-gradient.svg')", 'background-size': '100%' },
  { 'background-image': "url('/gradient-blue.jpg')", 'background-size': '100%' },
];
const styleObj = ref(backgroundImageList[0]);
const previousIndex = ref(0);

function randomBackground() {
  let randomIndex = Math.floor(Math.random() * backgroundImageList.length);
  while(randomIndex === previousIndex) {
    randomIndex = Math.floor(Math.random() * backgroundImageList.length);
  }

  previousIndex.value = randomIndex;

  styleObj.value = backgroundImageList[randomIndex];
}

function playEvent(play) {
  isPlaying.value = play;
}
</script>

<template>
  <div class="p-2 h-screen flex justify-center items-center bg-black" :style="styleObj">
    <div class="block">
      <TimerCounter @play="playEvent" />
      <MusicPlayer :isPlaying="isPlaying" />
    </div>
    <BackgroundImage @changeBackground="randomBackground" />
    <FullScreen />
  </div>
</template>

