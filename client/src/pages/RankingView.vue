<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCountryStore } from "../store/useCountryStore.ts"
import { countryCodeT } from "../type/countryType.ts";
import { getRecipeRankingByCountryCode } from "../services/api";
import type { components } from "../schema.d.ts"

// TODO: devide component just check move
import { useRecipeState } from '../store/useRecipe.ts'
const { setRecipe } = useRecipeState()
const registerRecipePinia = (recipe: components["schemas"]["Recipe"]) => {
	console.log(recipe)
	setRecipe(recipe)
}

const store = useCountryStore()
const rankings = ref<components["schemas"]["RecipeRankingBody"] | null>()
const currentCountry: countryCodeT | "" = store.getCountryName()

const fetchRecipeRanking = async () => {
	try {
		if (currentCountry) {
			rankings.value = await getRecipeRankingByCountryCode(currentCountry)
		}
	}
	catch (error) {
		console.error("Failed to fetch", error);
		rankings.value = null;
	}
}
onMounted(fetchRecipeRanking)

</script>

<template>
	<main>
		<h1>RankingView.vue</h1>
		<RouterLink to="/">国選択に戻る</RouterLink>

		<div v-if="rankings?.recipes?.length">
			<div v-for="(recipe, index) in rankings?.recipes">
				<div v-if="index < 3" :class="'ranking' + index">
					This is ranking {{ index }}
				</div>
				<img :src="recipe?.thumbnail" />
				<RouterLink 
					@click="registerRecipePinia(recipe)"
					:to="{
						name: 'recipe', 
						params: { id: recipe?.id }
					}"
				>
					<p>{{ recipe?.name }}</p>
				</RouterLink>
			</div>
		</div>
	</main>
</template>

<style lang="css" scoped>
.ranking0 {
	background-color: red;
}
.ranking1 {
	background-color: blue;
}
.ranking2 {
	background-color: yellow;
}
</style>

