<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goPlaylist() {
router.push('/admin/playlist');
}

function goWallpapers() {
  router.push('/admin/wallpaper');
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex justify-between bg-gray-600/80 p-4 text-white">
    <div>
      <h1 class="font-sans font-thin text-lg cursor-pointer" @click="goHome">Mo Timer</h1>
    </div>
    <div class="flex gap-4">
      <button class="border-2 border-gray-400 rounded-md px-2 hover:border-gray-200 hover:scale-105 transition ease-out duration-75" @click="goPlaylist">Playlists</button>
      <button class="border-2 border-gray-400 rounded-md px-2 hover:border-gray-200 hover:scale-105 transition ease-out duration-75" @click="goWallpapers">Wallpapers</button>
    </div>
  </div>
</template>
