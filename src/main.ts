import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/assets/main.css';

import App from './App.vue';
import router from './router/index.ts';
import '@/validation/index.ts';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
