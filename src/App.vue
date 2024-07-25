<script setup>
import TimerCounter from './components/TimerCounter.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import FullScreen from './components/FullScreen.vue'
</script>

<template>
  <div class="p-2 h-screen flex justify-center items-center bg-black" style="background-image: url('/wave-pattern.svg')" >
    <TimerCounter />
    <MusicPlayer />
    <FullScreen />
  </div>
</template>
