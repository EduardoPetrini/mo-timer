<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';
import BackgroundImage from './components/BackgroundImage.vue';
import FullScreen from './components/FullScreen.vue';
import TimerTab from './components/TimerTab.vue';
import Header from './components/Header.vue';
import { storeGet, storeSet } from './utils/storage';
import PlayerSelector from './components/PlayerSelector.vue';

const isPlaying = ref(false);
const showHeader = ref(false);
const isRequestTogglePlayChanged = ref({ active: false });
const backgroundImageList = [];

const styleObj = ref('');
const previousIndex = ref(0);

const auth = getAuth();

const KEYBOARD_EVENTS = ['Space', 'MediaPlayPause'];

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
  if (!KEYBOARD_EVENTS.includes(event.code) || event.target.tagName !== 'BODY') {
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

  onAuthStateChanged(auth, user => {
    if (!user) {
      return;
    }

    console.log('User is logged');
    showHeader.value = true;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', spacePressed);
});
</script>

<template>
  <div class="h-screen overflow-hidden" :style="styleObj">
    <Header v-if="showHeader" />
    <div class="flex h-full justify-center items-center">
      <RouterView @play="playEvent" :isRequestTogglePlayChanged="isRequestTogglePlayChanged" :isPlaying="isPlaying" />
      <BackgroundImage @changeBackground="randomBackground" />
      <FullScreen />
    </div>
  </div>
</template>
