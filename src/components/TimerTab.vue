<script setup>
import { ref } from 'vue';
import TimerCounter from './TimerCounter.vue';
import AscCounter from './AscCounter.vue';

const props = defineProps(['isRequestTogglePlayChanged']);
const emit = defineEmits(['play']);

const isAsc = ref(false);

function tabSelect(value) {
  isAsc.value = value;
}

function emitPlay(...args) {
  emit('play', ...args);
}
</script>

<template>
  <div class="flex text-gray-200 justify-between p-2">
    <button class="btn w-full" @click="tabSelect(false)" :class="{ 'btn-active': !isAsc, 'scale-90': isAsc }">Timer</button>
    <button class="btn w-full" @click="tabSelect(true)" :class="{ 'btn-active': isAsc, 'scale-90': !isAsc }">Infinite</button>
  </div>
  <TimerCounter v-show="!isAsc" @play="emitPlay" :isRequestTogglePlayChanged="props.isRequestTogglePlayChanged" :isAsc="isAsc" />
  <AscCounter v-show="isAsc" @play="emitPlay" :isRequestTogglePlayChanged="props.isRequestTogglePlayChanged" :isAsc="isAsc" />
</template>
