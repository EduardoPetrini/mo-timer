<script setup>
import TimerTab from './TimerTab.vue';
import PlayerSelector from './PlayerSelector.vue';

const props = defineProps(['isRequestTogglePlayChanged', 'isPlaying']);
const emit = defineEmits(['play']);
</script>

<template>
  <div class="block">
    <TimerTab @play="(...args) => emit('play', ...args)" :isRequestTogglePlayChanged="props.isRequestTogglePlayChanged" />
    <PlayerSelector :isPlaying="props.isPlaying" />
  </div>
</template>
