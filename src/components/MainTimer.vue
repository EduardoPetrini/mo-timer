<script setup>
import TimerTab from './TimerTab.vue';
import PlayerSelector from './PlayerSelector.vue';

const props = defineProps(['isRequestTogglePlayChanged', 'isPlaying']);
const emit = defineEmits(['play']);

function emitPlay(...args) {
  emit('play', ...args);
}
</script>

<template>
  <div class="block">
    <TimerTab @play="emitPlay" :isRequestTogglePlayChanged="props.isRequestTogglePlayChanged" />
    <PlayerSelector :isPlaying="props.isPlaying" />
  </div>
</template>
