<script setup lang="ts">
import type { components } from "../schema.d.ts"
import { onMounted, ref, computed } from "vue"
import { useCountryStore } from "../store/useCountryStore.ts"
import GoodButton from '../components/GoodButton.vue'
import ArrowLink from '../components/ArrowLink.vue'
import RecipeIngredient from '../components/RecipeIngredient.vue'
import MarkDownRender from '../components/MarkDownRender.vue'
import { likeRecipeByCountryAndId, unlikeRecipeByCountryAndId, getRecipeByCountryAndId } from "../services/api.ts"
import NavBar from '../components/NavBar.vue'
import { getFlagImageByAvailableCountryCodes } from "../constants/flags.ts"

const props = defineProps<{
	id: string
}>();

const countryStore = useCountryStore()
const countryName = countryStore.countryName
const recipe = ref<components["schemas"]["Recipe"] | null>(null)
const countryFlag = computed(() =>
  countryStore.countryName ? getFlagImageByAvailableCountryCodes(countryStore.countryName) : undefined
);

onMounted(async () => {
	if (!countryStore.countryName) {
		countryStore.loadFromLocalStorage();
	}
  if (countryStore.countryName) {
    await getRecipeData(countryStore.countryName);
  }
});

const getRecipeData = async (countryName: string) => {
  try {
    recipe.value = await getRecipeByCountryAndId(countryName, props.id) as components["schemas"]["Recipe"];
  } catch (error) {
    console.error(`Failed to fetch recipe: ${error}`);
  }
};

const handleGoodButtonClick = async (status: string) => {
	if (recipe.value) {
		if (status === 'like') {
			try {
				await likeRecipeByCountryAndId(countryName, props.id)
			}
			catch(error) {
				console.error(`likeRecipeByCountryAndId ${error}`)
			}
		}
		else if (status === 'unlike') {
			try {
				await unlikeRecipeByCountryAndId(countryName, props.id)
			}
			catch(error){
				console.error(`unlikeRecipeByCountryAndId ${error}`)
			}
		}
	}
}

</script>
<template>
	<main>
		<NavBar
			:flag-path="countryFlag"
		/>
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
					<img
						:src="recipe.thumbnail"
						alt=""
						width="343px" height="243px"
						style="object-fit: cover;">
				</div>
				<MarkDownRender
					:text="recipe?.instructions"
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
