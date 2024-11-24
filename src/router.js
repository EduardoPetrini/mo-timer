import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import NotFound from './components/NotFound.vue';
import Login from './components/Login.vue';
import MainTimer from './components/MainTimer.vue';
import PlayListHome from './components/playlist/PlayListHome.vue';
import WallpaperHome from './components/wallpaper/WallpaperHome.vue';

const routes = [
  { path: '/', component: MainTimer, name: 'home' },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'notFound' },
  { path: '/admin/login', component: Login },
  { path: '/admin/playlist', component: PlayListHome, meta: { requiresAuth: true } },
  { path: '/admin/wallpaper', component: WallpaperHome, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

const auth = getAuth();

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    onAuthStateChanged(auth, user => {
      if (user) {
        next();
      } else {
        next({ path: '/admin/login' });
      }
    });
  } else {
    next();
  }
});
