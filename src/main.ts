import {createApp} from 'vue'
import App from './App.vue'
import router from '@Router/index'
import store from '@Router/index'

createApp(App).use(store).use(router).mount('#app-root')
