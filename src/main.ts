/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { VueQueryPlugin } from '@tanstack/vue-query'
import 'uno.css'
import './styles/index.scss'
const app = createApp(App)

app.use(VueQueryPlugin)

registerPlugins(app)

app.mount('#app')
