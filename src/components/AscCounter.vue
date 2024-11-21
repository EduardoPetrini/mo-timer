<script setup>
import { computed, ref, watch, watchEffect } from 'vue';

const props = defineProps(['isRequestTogglePlayChanged', 'isAsc']);
const emit = defineEmits(['play']);

const isPlaying = ref(false);
const second = ref(0);
const minute = ref(0);
const hour = ref(0);
let intervalId;

const startResume = () => {
  if (!props.isAsc){
    pausePlay();
    return;
  }

  const interval = setInterval(() => {
    if (second.value === 59) {
      second.value = 0;
      return;
    }
    second.value++;
  }, 1000);

  return interval;
};

watchEffect(async () => {
  if (!isPlaying.value) {
    return;
  }

  if (second.value >= 59) {
    setTimeout(() => {
      clearInterval(intervalId);
      if (minute.value === 59) {
        hour.value++;
        minute.value = 0;
        second.value = 0;
        intervalId = startResume();
        return;
      }

      minute.value++;
      second.value = 0;
      intervalId = startResume();
    }, 1000);
  }
});

watch(props.isRequestTogglePlayChanged, () => {
  togglePlay();
});

watch(
  () => props.isAsc,
  isAsc => {
    if (!isAsc) {
      pausePlay();
    }
  }
);

function pausePlay() {
  isPlaying.value = false;

  emit('play', false);
  if (intervalId) {
    return clearInterval(intervalId);
  }
}

function togglePlay() {
  const isTimeRunning = isPlaying.value;
  isPlaying.value = !isPlaying.value;

  if (isTimeRunning) {
    emit('play', false);
    return clearInterval(intervalId);
  }

  emit('play', true);
  intervalId = startResume();
}

function reset() {
  clearInterval(intervalId);
  isPlaying.value = false;

  second.value = 0;
  minute.value = 0;
  hour.value = 0;

  emit('play', false);
}

function clicked(event) {
  event.target.select();
  pausePlay();
}

function focusOut() {
  togglePlay();
}

function onEnter(event) {
  event.target.blur();
}

const displayHour = computed(() => (hour.value.toString().length > 1 ? hour.value.toString().slice(-2) : hour.value.toString().padStart(2, '0')));
const displayMinute = computed(() => (minute.value.toString().length > 1 ? minute.value.toString().slice(-2) : minute.value.toString().padStart(2, '0')));
const displaySecond = computed(() => (second.value.toString().length > 1 ? second.value.toString().slice(-2) : second.value.toString().padStart(2, '0')));
</script>

<template>
  <div>
    <div class="flex sm:text-5xl md:text-6xl font-bold font-mono p-4 bg-gray-200/80 rounded-2xl shadow-md shadow-gray-200/80 hover:bg-gray-100 hover:shadow-lg hover:shadow-gray-100/80 transition ease-out duration-500">
      <input @focus="clicked" @blur="focusOut" @keyup.enter="onEnter" type="text" :value="displayHour" @input="event => (hour = event.target.value > 99 ? 99 : event.target.value)" class="time-input" />:
      <input @focus="clicked" @blur="focusOut" @keyup.enter="onEnter" type="text" :value="displayMinute" @input="event => (minute = event.target.value > 59 ? 59 : event.target.value)" class="time-input" />:
      <input @focus="clicked" @blur="focusOut" @keyup.enter="onEnter" type="text" :value="displaySecond" @input="event => (second = event.target.value > 59 ? 59 : event.target.value)" class="time-input" />
    </div>
    <div class="flex gap-4 text-gray-200 justify-around mt-4">
      <button v-show="!isPlaying" @click="togglePlay" class="btn" title="Click to start the timer and the song">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
      </button>
      <button v-show="isPlaying" @click="togglePlay" class="btn" title="Click to pause the timer and the song">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
        </svg>
      </button>
      <button @click="reset" class="btn" title="Click to reset the timer and pause the song">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </button>
    </div>
  </div>
</template>
