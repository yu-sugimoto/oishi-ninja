<script setup lang="ts">
import type { components } from '../schema.d.ts'

interface Props {
	ingredientQuantities?: {
		ingredient: components["schemas"]["Ingredient"],
		quantity: string
	}[],
}
const props = defineProps<Props>()

</script>

<template>
	<div v-if="ingredientQuantities">
		<div class="grid-table">
			<div class="grid-table__title top">
				項目
			</div>
			<div class="grid-table__content top">
				材料
			</div>
		</div>
		<div
			v-for="(ingredientQuantitity, index) in props.ingredientQuantities"
			:key="index"
			class="grid-table"
		>
			<div 
				class="grid-table__title element"
				:class="{last: index === ingredientQuantities.length - 1 ? true : false}"
			>
				{{ ingredientQuantitity.ingredient.name }}
			</div>
			<div 
				class="grid-table__content element"
				:class="{last: index === ingredientQuantities.length - 1 ? true : false}"
			>
				{{ ingredientQuantitity.quantity }}
			</div>
		</div>
	</div>
</template>

<style lang="css" scoped>
/*全体のスタイル*/
.grid-table {
	display: grid;
	grid-template-columns: 1fr 1fr;
}
.grid-table__title {
	display: flex;
	align-items: center;
	padding-left: 10px;
	font-size: 16px;
	width: 100px;
	height: 64px;
}
.grid-table__content {
	display: flex;
	align-items: center;
	padding-left: 22px;
	font-size: 16px;

	width: 210px;
	height: 64px;
}
/*最初のセルのスタイル*/
.grid-table__title.top {
	border-top: 1px solid var(--color-light-gray);
	border-left: 1px solid var(--color-light-gray);
	border-right: 1px solid var(--color-light-gray);
	border-bottom: 1px solid var(--color-light-gray);
	border-radius: 4px 0 0 0;
}
.grid-table__content.top {
	border-top: 1px solid var(--color-light-gray);
	border-right: 1px solid var(--color-light-gray);
	border-bottom: 1px solid var(--color-light-gray);
	border-radius: 0 4px 0 0;
}
/*最初と最後以外のセル*/
.grid-table__title.element {
	border-left: 1px solid var(--color-light-gray);
	border-right: 1px solid var(--color-light-gray);
	border-bottom: 1px solid var(--color-light-gray);

}
.grid-table__content.element {
	border-right: 1px solid var(--color-light-gray);
	border-bottom: 1px solid var(--color-light-gray);
}
/*最後のセル*/
.grid-table__title.last {
	border-left: 1px solid var(--color-light-gray);
	border-right: 1px solid var(--color-light-gray);
	border-bottom: 1px solid var(--color-light-gray);
	border-radius: 0 0 0 4px;
}
.grid-table__content.last {
	border-right: 1px solid var(--color-light-gray);
	border-bottom: 1px solid var(--color-light-gray);
	border-radius: 0 0 4px 0;
}
</style>

