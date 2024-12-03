<script setup>
import FullScreen from './FullScreen.vue';
import BackgroundImage from './BackgroundImage.vue';

const emit = defineEmits(['changeBackground']);

function changeBackground() {
  emit('changeBackground')
}
</script>
<template>
  <div class="mb-0 p-4 w-full">
    
    <div class="flex flex-col gap-4 align-middle items-end">
      <FullScreen />
      <BackgroundImage @changeBackground="changeBackground" />
    </div>
  </div>
</template>
