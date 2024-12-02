import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.css'

async function prepare() {
  if (import.meta.env.VITE_ENABLE_MOCK_API !== 'true') return

  const { worker } = await import('./mocks/browser')

  return worker.start()
}

prepare().then(() => {
  createApp(App)
		.use(router)
		.mount('#app')
})
