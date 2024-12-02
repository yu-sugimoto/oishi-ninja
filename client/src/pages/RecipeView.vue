<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
const increment = () => {
	count.value++
}
</script>
<template>
	<main>
		<h1>RecipeView.vue</h1>
		<div></div>
		<button @click="increment">Push!!</button>
		<h2>{{ count }}</h2>

		<button>
			<RouterLink to="/ranking">Go to Ranking</RouterLink>
		</button>
	</main>
</template>

