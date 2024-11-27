<script setup>
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const auth = getAuth();
const router = useRouter();

async function handleLogin() {
  errorMessage.value = '';
  try {
    const credentials = await signInWithEmailAndPassword(auth, email.value, password.value);

    if (credentials) {
      router.push('/');
    }
  } catch (error) {
    console.log(error);
    errorMessage.value = error.message;
  }
}

function goHome() {
  router.push('/');
}

onMounted(() => {
  onAuthStateChanged(auth, user => {
    if (!user) {
      return;
    }
    router.push('/');
  });
});
</script>

<template>
  <div class="flex min-w-80 items-center justify-center bg-gray-600/50 rounded-md border-white p-10">
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-800">Email</label>
        <input type="email" v-model="email" id="email" class="min-w-80 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder="you@example.com" required />
      </div>

      <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-800">Password</label>
        <input type="password" v-model="password" id="password" class="min-w-80 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200" placeholder="••••••••" required />
      </div>

      <button type="submit" class="w-full p-3 text-white rounded border-b-2 btn">Log In</button>
      <button type="button" class="w-full p-3 text-white rounded border-b-2 btn mt-2" @click.prevent="goHome">Home</button>

      <p v-if="errorMessage" class="mt-4 text-sm text-center text-red-500 bg-white px-2 rounded-md">{{ errorMessage }}</p>
    </form>
  </div>
</template>
