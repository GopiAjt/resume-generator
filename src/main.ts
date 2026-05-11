import './assets/main.css'
import './utils/mobilePolyfills'

import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'

import App from './App.vue'
import { routes, setupRouterGuards } from './router'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
  },
  ({ app, router }) => {
    app.use(createPinia())
    setupRouterGuards(router)
  },
)
