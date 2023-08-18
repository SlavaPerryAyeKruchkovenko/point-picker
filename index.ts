import {createApp} from 'vue'
import App from './src/App.vue'
import router from './src/router'
import store from './src/store'
import 'reset-css';

createApp(App).use(store).use(router).mount('#app-root')
