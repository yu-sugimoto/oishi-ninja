<script setup lang="ts">
import type { components } from "../schema.d.ts"
import { onMounted, ref } from "vue"
import type { Ref } from "vue"
import { useRecipeState } from "../store/useRecipe.ts"

const store = useRecipeState()
const recipe: Ref<components["schemas"]["Recipe"] | ""> = ref("")

const setRecipeToRef = () => {
	const storedRecipe = store.getRecipe().value
	if (storedRecipe !== "") {
		recipe.value =  storedRecipe as components["schemas"]["Recipe"]
	}
}

onMounted(setRecipeToRef)
</script>
<template>
	<main>
		<h1>RecipeView.vue</h1>
		<button>
			<RouterLink to="/ranking">Go to Ranking</RouterLink>
		</button>
		<h2 v-if="recipe">
			{{ recipe.name }}
			<img :src="recipe.thumbnail" alt="">

			<div class="recipeTextArea">
				{{ recipe.instructions }}
			</div>

			<div class="recipeIngredients">
				<div v-for="(ingredientQuantity, index) in recipe.ingredientQuantities" :key="index">
					<p>
						{{ ingredientQuantity.ingredient.name }} : {{ ingredientQuantity.quantity }}
					</p>
				</div>
			</div>
		</h2>
	</main>
</template>

