<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
const increment = () => {
	count.value++
}
</script>
<template>
	<main>
	<h1>HomeView.vue</h1>
	<button>
		<RouterLink to="/ranking">Go to Ranking</RouterLink>
	</button>
		<button @click="increment">Push!!</button>
		<h2>{{ count }}</h2>
	</main>
</template>

