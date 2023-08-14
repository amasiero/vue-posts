import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router } from './router';
import { usePosts } from './stores/posts';
import { useUsers } from './stores/users';

const app = createApp(App);
app.use(createPinia());

const usersStore = useUsers();
const postsStore = usePosts();

Promise.all([usersStore.authenticate(), postsStore.fetchPosts()]).then(() => {
  app.use(router);
  app.mount('#app');
});
