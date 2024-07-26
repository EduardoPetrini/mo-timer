<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import TimerCounter from './components/TimerCounter.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import BackgroundImage from './components/BackgroundImage.vue';
import FullScreen from './components/FullScreen.vue';

const isPlaying = ref(false);
const isRequestTogglePlayChanged = ref({ active: false });
const backgroundImageList = [
  { 'background-image': "url('/wave-pattern.svg')" },
  { 'background-image': "url('/chair-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/desert-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/flower-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/gironda-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/landscape-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/mini-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/moon-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/mountain-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/road-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/sand-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/waterfall-unsplash.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/xatula.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/xatula2.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/car.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/cloud.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/child.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/forest.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/gato.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/japan1.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/jp-tree.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/land.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/lotr1.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/lotr2.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/lotr3.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/lotr4.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/moon.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/moon2.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/new-york.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/room.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/roses.jpg')", 'background-size': 'cover' },
  { 'background-image': "url('/warrior.jpg')", 'background-size': 'cover' },
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
  previousIndex.value++;

  if (previousIndex.value === backgroundImageList.length) {
    previousIndex.value = 0;
  }

  styleObj.value = backgroundImageList[previousIndex.value];
}

function playEvent(play) {
  isPlaying.value = play;
}

function spacePressed(event) {
  if (event.code !== 'Space' || event.target.tagName !== 'BODY') {
    return;
  }

  isRequestTogglePlayChanged.value.active = !isRequestTogglePlayChanged.value.active;
  console.log('changed', isRequestTogglePlayChanged.value);
}

onMounted(() => {
  window.addEventListener('keyup', spacePressed);
});
onBeforeUnmount(() => {
  window.removeEventListener('keyup', spacePressed);
});
</script>

<template>
  <div class="p-2 h-screen flex justify-center items-center bg-black" :style="styleObj">
    <div class="block">
      <TimerCounter @play="playEvent" :isRequestTogglePlayChanged="isRequestTogglePlayChanged" />
      <MusicPlayer :isPlaying="isPlaying" />
    </div>
    <BackgroundImage @changeBackground="randomBackground" />
    <FullScreen />
  </div>
</template>

