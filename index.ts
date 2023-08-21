import {createApp} from 'vue'
import App from './src/App.vue'
import router from './src/router'
import store from './src/store'
import 'reset-css';
import VueFeather from 'vue-feather';

createApp(App).component(VueFeather.name, VueFeather).use(store).use(router).mount('#app-root')
