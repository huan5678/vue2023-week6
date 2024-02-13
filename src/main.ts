import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index';
import App from './App.vue';
import '@/assets/main.css';
import '@/validation';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
