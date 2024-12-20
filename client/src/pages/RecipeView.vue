<script setup lang="ts">
import type { components } from "../schema.d.ts"
import { onMounted, ref } from "vue"
import type { Ref } from "vue"
import { useRecipeState } from "../store/useRecipe.ts"
import { useCountryStore } from "../store/useCountryStore.ts"
import GoodButton from '../components/GoodButton.vue'
import ArrowLink from '../components/ArrowLink.vue'
import RecipeInstructions from '../components/RecipeInstructions.vue'
import RecipeIngredient from '../components/RecipeIngredient.vue'

import { likeRecipeByCountryAndId, unlikeRecipeByCountryAndId } from "../services/api.ts"

const recipeStore = useRecipeState()
const countryStore = useCountryStore()

const countryName = countryStore.countryName
const recipe: Ref<components["schemas"]["Recipe"] | ""> = ref("")

const setRecipeToRef = () => {
	const storedRecipe = recipeStore.getRecipe().value
	if (storedRecipe !== "") {
		recipe.value = storedRecipe as components["schemas"]["Recipe"]
	}
}

const handleGoodButtonClick = (status: string) => {
	if (recipe.value) {
		if (status === 'like') {
			likeRecipeByCountryAndId(countryName, recipe.value.id)
		}
		else if (status === 'unlike') {
			unlikeRecipeByCountryAndId(countryName, recipe.value.id)
		}
	}
}

onMounted(setRecipeToRef)
</script>
<template>
	<main>
		<ArrowLink
			to="/ranking"
			message="ランキングページに戻る"
			class="arrow-link-top"
		/>
		<div class="recipe-page-center" v-if="recipe">
				<div class="recipe-page__title">
					<div class="recipe-page__name">
						{{ recipe.name }}
					</div>
					<div>
						<GoodButton
							:likeCount="recipe.likes"
							@good-button-click="handleGoodButtonClick"
						/>
					</div>
				</div>
				<div class="recipe-page__keyvisual">
					<img :src="recipe.thumbnail" alt="" width="343px" height="243px">
				</div>
				<RecipeInstructions 
					:instructions="recipe?.instructions"
				/>
				<RecipeIngredient
					:ingredientQuantities="recipe?.ingredientQuantities"
					class="recipe-page__ingredient"
				/>

		</div>
		<ArrowLink
			to="/ranking"
			message="ランキングページに戻る"
			class="arrow-link-bottom"
		/>
	</main>
</template>

<style lang="css">

.recipe-page-center {
	width: 343px;
	margin: 0 auto;
}
.recipe-page__title {
	display: flex;
	justify-content: space-between;
	margin-top: 35px;
	margin-left: 10px;
	margin-bottom: 20px;
	margin-right: 25px;
	font-size: 32px;
}
.recipe-page__keyvisual {
	margin: 30px auto;
	text-align: center;
}
.recipe-page__ingredient {
	margin-top: 40px;
	margin-bottom: 20px;
}
.arrow-link-top {
	margin-top: 20px;
}
.arrow-link-bottom {
	margin-top: 50px;
	margin-bottom: 50px;
}
</style>

