import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

async function prepare() {
  if (import.meta.env.VITE_ENABLE_MOCK_API !== 'true') return

  const { worker } = await import('./mocks/browser')

  return worker.start()
}

prepare().then(() => {
	const pinia = createPinia()
	pinia.use(piniaPluginPersistedstate)

  createApp(App)
		.use(router)
		.use(pinia)
		.mount('#app')
})

