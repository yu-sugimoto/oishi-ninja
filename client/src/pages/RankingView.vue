<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useCountryStore } from "../store/useCountryStore.ts"
import { countryCodeT } from "../type/countryType.ts"
import { getRecipeRankingByCountryCode } from "../services/api"
import RecipeCard from "../components/RecipeCard.vue"
import ArrowLink from "../components/ArrowLink.vue"
import type { components } from "../schema.d.ts"

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
		<ArrowLink
			to="/"
			message="国選択に戻る"
			class="arrowlink-top"
		/>

		<div v-if="rankings?.recipes?.length">
			<div class="recipe-cards" v-for="(recipe, index) in rankings?.recipes" :key="recipe.id">
					<RecipeCard
						@recipe-img-click="registerRecipePinia(recipe)"
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
