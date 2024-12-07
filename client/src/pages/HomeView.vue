<script setup lang="ts">
import { ref } from "vue"
import { useCountryStore } from './stores/useCountryStore.ts';
import ChooseCountry from "../components/ChooseCountry.vue";

</script>
<template>
	<main>
	<h1>HomeView.vue</h1>
	<button>
		<RouterLink to="/ranking">Go to Ranking</RouterLink>
	</button>
	<ChooseCountry />
	</main>
</template>

