import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/HomeView.vue'
import RecipeView from './pages/RecipeView.vue'
import RankingView from './pages/RankingView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/ranking', component: RankingView },
  { 
		path: '/recipe/:id', 
		name: 'recipe',
		component: RecipeView, 
		props: true,
	},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
