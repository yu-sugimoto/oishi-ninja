<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
const increment = () => {
	count.value++
}
</script>
<template>
	<main>
		<h1>RankingView.vue</h1>
		<RouterLink to="/">国選択に戻る</RouterLink>
		<button @click="increment">Push!!</button>
		<h2>{{ count }}</h2>
		<button>
			<RouterLink to="/recipe">Go to Recipe</RouterLink>
		</button>
		<RouterView />
	</main>
</template>

