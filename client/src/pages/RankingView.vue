<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCountryStore } from "../store/useCountryStore.ts"
import { getFlagImageByAvailableCountryCodes } from "../constants/flags.ts"
import { getRecipeRankingByCountryCode } from "../services/api"
import RecipeCard from "../components/RecipeCard.vue"
import ArrowLink from "../components/ArrowLink.vue"
import type { components } from "../schema.d.ts"
import NavBar from "../components/NavBar.vue"

const store = useCountryStore()
const rankings = ref<components["schemas"]["RecipeRankingBody"] | null>()
const currentCountry = store.getCountryName()
const countryFlag: string | undefined = currentCountry
  ? getFlagImageByAvailableCountryCodes(currentCountry)
  : undefined;

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
		<NavBar
			:flag-path="countryFlag"
		/>
		<ArrowLink
			to="/"
			message="国選択に戻る"
			class="arrowlink-top"
		/>

		<div v-if="rankings?.recipes?.length">
			<div class="recipe-cards" v-for="(recipe, index) in rankings?.recipes" :key="recipe.id">
					<RecipeCard
						link-page-name="recipe"
						:link-id="recipe?.id"
						:ranking-index="index"
						:image-path="recipe?.thumbnail"
						:title="recipe?.name"
					/>
			</div>
		</div>
		<ArrowLink
			to="/"
			message="国選択に戻る"
			class="arrowlink-bottom"
		/>
	</main>
</template>

<style lang="css" scoped>
.recipe-cards {
	display: flex;
	justify-content: center;
}
.arrowlink-top {
	margin-top: 20px;
	margin-right: 10px;
	margin-left: 10px;
}
.arrowlink-bottom {
	margin-top: 20px;
	margin-right: 10px;
	margin-bottom: 20px;
	margin-left: 10px;
}
</style>
