<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';
import MusicPlayer from './components/MusicPlayer.vue';
import BackgroundImage from './components/BackgroundImage.vue';
import FullScreen from './components/FullScreen.vue';
import TimerTab from './components/TimerTab.vue';
import { storeGet, storeSet } from './utils/storage';

const isPlaying = ref(false);
const isRequestTogglePlayChanged = ref({ active: false });
const backgroundImageList = [];

const styleObj = ref('');
const previousIndex = ref(0);

function randomBackground() {
  previousIndex.value++;

  if (previousIndex.value === backgroundImageList.length) {
    previousIndex.value = 0;
  }

  storeSet('bg-index', `${previousIndex.value}`);

  setStyle(previousIndex.value);
}

function setStyle(index) {
  styleObj.value = { 'background-image': `url('${backgroundImageList[index]}')`, 'background-size': 'cover' };
}

function playEvent(play) {
  isPlaying.value = play;
}

function spacePressed(event) {
  if (event.code !== 'Space' || event.target.tagName !== 'BODY') {
    return;
  }

  isRequestTogglePlayChanged.value.active = !isRequestTogglePlayChanged.value.active;
}

onMounted(async () => {
  const savedBackground = await getDocs(collection(db, 'background'));
  savedBackground.forEach(doc => {
    backgroundImageList.push(doc.data().bg);
  });
  setStyle(0);

  window.addEventListener('keyup', spacePressed);
  const bgIndex = storeGet('bg-index');

  if (bgIndex) {
    previousIndex.value = Number(bgIndex);
    setStyle(previousIndex.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('keyup', spacePressed);
});
</script>

<template>
  <div class="p-2 h-screen flex justify-center items-center bg-black" :style="styleObj">
    <div class="block">
      <TimerTab @play="playEvent" :isRequestTogglePlayChanged="isRequestTogglePlayChanged" />
      <MusicPlayer :isPlaying="isPlaying" />
    </div>
    <BackgroundImage @changeBackground="randomBackground" />
    <FullScreen />
  </div>
</template>

