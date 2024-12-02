import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './pages/HomeView.vue'
import RecipeView from './pages/RecipeView.vue'
import RankingView from './pages/RankingView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/ranking', component: RankingView },
  { path: '/recipe', component: RecipeView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
