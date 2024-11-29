<script setup>
import { onMounted, ref } from 'vue';
import Delete from '../icons/Delete.vue';
import { useBackgroundStore } from '../../stores/backgroundStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

const auth = getAuth();
const router = useRouter();


const wallpaperList = ref([]);
const isToAdd = ref(false);
const newBackground = ref('');
const errorMessage = ref('');

const backgroundStore = useBackgroundStore();

async function deleteBg(wp) {
  console.log('Deleting...', wp);

  try {
    const results = await backgroundStore.deleteWallpaper(wp);
    wallpaperList.value = await backgroundStore.getWallpapers();
  } catch (error) {
    console.error(error);
    errorMessage.value = error.message;
  }
}

function addWallpaper() {
  isToAdd.value = !isToAdd.value;
}

function cancelSave() {
  isToAdd.value = false;
}

async function saveWallpaper() {
  console.log('Saving', newBackground.value);
  const results = await backgroundStore.addWallpaper(newBackground.value);

  wallpaperList.value = await backgroundStore.getWallpapers();
  isToAdd.value = false;
}

onMounted(async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      return;
    }
    router.push('/');
  });

  wallpaperList.value = await backgroundStore.getWallpapers();
});
</script>

<template>
  <div class="">
    <div class="flex gap-4 mb-2">
      <span class="px-2 bg-gray-600/60 text-gray-300 rounded-md content-center">Total: {{ wallpaperList.length }}</span>
    </div>
    <div class="flex p-4 bg-gray-200/90 max-h-96 overflow-y-scroll">
      <table class="min-w-full h-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-100 border-b">
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 min-w-96">Link</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Image</th>
            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="wp in wallpaperList" :key="wp.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">
              <a :href="wp.bg" target="_blank"> {{ wp.bg.length > 65 ? wp.bg.slice(0, 65) + '...' : wp.bg }}</a>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <img :src="wp.bg" alt="" height="100" width="100" />
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <Delete class="cursor-pointer" title="Delete post" @click="deleteBg(wp)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <button class="btn-add mt-2 mb-2" @click="addWallpaper">Add</button>
    </div>
    <div v-show="isToAdd">
      <div class="flex flex-col bg-gray-100 rounded-md">
        <input class="p-2 rounded-md" placeholder="AWS S3 Image link" v-model="newBackground" />
      </div>
      <div class="flex justify-between">
        <button class="btn-add mt-2 text-red-400" @click="cancelSave">Cancel</button>
        <button class="btn-add mt-2" @click="saveWallpaper">Save</button>
      </div>
      <div>
        <span class="text-red-600">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>
