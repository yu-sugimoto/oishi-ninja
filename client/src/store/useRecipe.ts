import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { readonly } from 'vue'
import type { components } from "../schema.d.ts"
export const useRecipeState = defineStore('recipe', () => {
	type recipeType = components["schemas"]["Recipe"];

	const recipeRef: Ref<recipeType | ''> = ref('')

	const setRecipe = (recipe: recipeType): void => {
		recipeRef.value = recipe;
	}

	const getRecipe = () => {
		return readonly(recipeRef)
	}

	return { setRecipe, getRecipe }
})

