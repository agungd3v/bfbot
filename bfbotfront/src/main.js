import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import socket from './plugins/wss'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)

app.use(createPinia())
app.use(socket)
app.use(router)

app.mount('#app')

import 'bootstrap/dist/js/bootstrap.js'