<script setup lang="ts">
import type { components } from "../schema.d.ts"
import { onMounted, ref } from "vue"
import type { Ref } from "vue"
import { useRecipeState } from "../store/useRecipe.ts"
import GoodButton from '../components/GoodButton.vue'
import ArrowLink from '../components/ArrowLink.vue'

const store = useRecipeState()
const recipe: Ref<components["schemas"]["Recipe"] | ""> = ref("")

const setRecipeToRef = () => {
	const storedRecipe = store.getRecipe().value
	if (storedRecipe !== "") {
		recipe.value =  storedRecipe as components["schemas"]["Recipe"]
	}
}

onMounted(setRecipeToRef)

const handleGoodButtonClick = () => {

}
</script>
<template>
	<main>
		<ArrowLink
			to="/ranking"
			message="ランキングページに戻る"
		/>
		<div class="recipe-page-center" v-if="recipe">
				<div class="recipe-page__title">
					<div class="recipe-page__name">
						{{ recipe.name }}
					</div>
					<div>
						<GoodButton
							@good-button-click="handleGoodButtonClick()"
						/>
					</div>
				</div>
				<div class="recipe-page__keyvisual">
					<img :src="recipe.thumbnail" alt="" width="343px" height="243px">
				</div>
				<div class="recipe-page__instructions">
					{{ recipe.instructions }}
				</div>

				<div class="recipe-page__ingredients">
					<div v-for="(ingredientQuantity, index) in recipe.ingredientQuantities" :key="index">
						<p>
							{{ ingredientQuantity.ingredient.name }} : {{ ingredientQuantity.quantity }}
						</p>
					</div>
				</div>
		</div>
		<ArrowLink
			to="/ranking"
			message="ランキングページに戻る"
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
	margin-top: 20px;
	margin-bottom: 20px;
	margin-left: 25px;
	margin-right: 25px;
	font-size: 32px;
}
.recipe-page__keyvisual {
	margin: 0 auto;
	text-align: center;
}
.recipe-page__instructions {
	font-size: 16px;
}
.recipe-page__ingredients {
	font-size: 16px;
}
</style>

