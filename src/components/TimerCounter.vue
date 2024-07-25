<script setup>
import { ref, watchEffect } from 'vue';
import MusicPlayer from './MusicPlayer.vue'
const isPlaying = ref(true);
const second = ref(0);
const minute = ref(60);
const hour = ref(0);
let intervalId;

const startResume = () => {
  const interval = setInterval(() => {
    if (second.value === 0) {
      second.value = 59;
      return;
    }
    second.value--;
  }, 1000);

  return interval;
};

watchEffect(() => {
  if (!isPlaying.value) {
    return;
  }

  if (second.value <= 0 && minute.value <= 0 && hour.value <= 0) {
    return clearInterval(intervalId);
  }

  if (second.value <= 0) {
    setTimeout(() => {
      if (minute.value === 0) {
        hour.value--;
        minute.value = 59;
        return;
      }
      minute.value--;
      second.value = 59;
    }, 1000);
  }
});

function togglePlay() {
  const isTimeRunning = isPlaying.value;
  isPlaying.value = !isPlaying.value;

  if (isTimeRunning) {
    return clearInterval(intervalId);
  }

  intervalId = startResume();
}

function reset() {
  clearInterval(intervalId);
  isPlaying.value = false;

  second.value = 0;
  minute.value = 60;
  hour.value = 0;
}

intervalId = startResume();
</script>

<template>
  <div>
    <div class="flex text-6xl font-bold font-mono p-4 bg-gray-200/80 rounded-2xl shadow-md shadow-gray-200/80 hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-100/80 transition ease-out duration-500">
      <span>{{ hour.toString().padStart(2, '0') }}:</span>
      <span>{{ minute.toString().padStart(2, '0') }}:</span>
      <span>{{ second.toString().padStart(2, '0') }}</span>
    </div>
    <div class="flex gap-4 text-gray-200 justify-around mt-4">
      <button v-show="!isPlaying" @click="togglePlay" class="hover:text-amber-100 hover:scale-125 transition ease-out duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
      </button>
      <button v-show="isPlaying" @click="togglePlay" class="hover:text-amber-100 hover:scale-125 transition ease-out duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
      </button>
      <button @click="reset" class="hover:text-amber-100 hover:scale-125 transition ease-out duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </div>
    <MusicPlayer />
  </div>
</template>
