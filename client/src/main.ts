import { createApp } from 'vue'
import router from './router'
import './style.css'
import App from './App.vue'

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
