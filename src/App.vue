<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BackgroundImage from './components/BackgroundImage.vue';
import FullScreen from './components/FullScreen.vue';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import { storeGet, storeSet } from './utils/storage';
import { useBackgroundStore } from './stores/backgroundStore';
import { useRouter } from 'vue-router';

const isPlaying = ref(false);
const showHeader = ref(false);
const isRequestTogglePlayChanged = ref({ active: false });
const backgroundImageList = [];

const styleObj = ref('');
const previousIndex = ref(0);

const backgroundStore = useBackgroundStore();
const router = useRouter();

const auth = getAuth();

const KEYBOARD_EVENTS = ['Space', 'MediaPlayPause'];
const LOGIN_SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyB'];
const userLoginSequence = ref([]);

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

function sequencesForLogin(event) {
  userLoginSequence.value.push(event.code);

  if (userLoginSequence.value.length > LOGIN_SEQUENCE.length) {
    userLoginSequence.value = userLoginSequence.value.slice(userLoginSequence.value.length - LOGIN_SEQUENCE.length);
  }

  if (userLoginSequence.value.length !== LOGIN_SEQUENCE.length) {
    return;
  }

  if (userLoginSequence.value.join(' ') === LOGIN_SEQUENCE.join(' ')) {
    router.push('/admin/login');
    userLoginSequence.value = [];
  }
}

onMounted(async () => {
  const savedBackground = await backgroundStore.getWallpapers();
  savedBackground.forEach(doc => {
    backgroundImageList.push(doc.bg);
  });
  setStyle(0);

  window.addEventListener('keyup', spacePressed);
  window.addEventListener('keyup', sequencesForLogin);

  const bgIndex = storeGet('bg-index');

  if (bgIndex) {
    previousIndex.value = Number(bgIndex);
    setStyle(previousIndex.value);
  }

  onAuthStateChanged(auth, user => {
    if (!user) {
      return;
    }

    showHeader.value = true;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', spacePressed);
  window.removeEventListener('keyup', sequencesForLogin);
});
</script>

<template>
  <div class="h-screen flex flex-col" :style="styleObj">
    <Header v-if="showHeader" />
    <div class="flex-grow flex justify-center items-center">
      <RouterView @play="playEvent" :isRequestTogglePlayChanged="isRequestTogglePlayChanged" :isPlaying="isPlaying" />
    </div>
    <Footer @changeBackground="randomBackground"/>
  </div>
</template>
