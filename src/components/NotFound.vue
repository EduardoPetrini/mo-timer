<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<template>
  <div class="bg-gray-800/80 w-80 flex justify-center align-middle text-white p-10 cursor-pointer" @click="goHome">NotFound</div>
</template>
