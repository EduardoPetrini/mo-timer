<script setup>
import { ref } from 'vue';
import TimerCounter from './TimerCounter.vue';
import AscCounter from './AscCounter.vue';

const { isRequestTogglePlayChanged } = defineProps(['isRequestTogglePlayChanged']);
const emit = defineEmits(['play']);

const isAsc = ref(false);

function tabSelect(value) {
  isAsc.value = value;
}
</script>

<template>
  <div class="flex text-gray-200 justify-between p-2">
    <button class="btn w-full" @click="tabSelect(false)" :class="{ 'btn-active': !isAsc, 'scale-90': isAsc }">Timer</button>
    <button class="btn w-full" @click="tabSelect(true)" :class="{ 'btn-active': isAsc, 'scale-90': !isAsc }">Infinite</button>
  </div>
  <TimerCounter v-show="!isAsc" @play="(...args) => emit('play', ...args)" :isRequestTogglePlayChanged="isRequestTogglePlayChanged" />
  <AscCounter v-show="isAsc" @play="(...args) => emit('play', ...args)" :isRequestTogglePlayChanged="isRequestTogglePlayChanged" />
</template>
