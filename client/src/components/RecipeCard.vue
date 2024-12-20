<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	linkPageName: string
	linkId: string,
	rankingIndex: number,
	imagePath: string,
	title: string,
}
const props = defineProps<Props>()

interface Emits {
	(event: 'recipe-img-click'): void
}
const emits = defineEmits<Emits>()

const handleImgClick = () => {
	emits('recipe-img-click')
}

const rankingStartIndex = 0
const rankingEndIndex = 2

const isShowRanking = () => {
	return rankingStartIndex <= props.rankingIndex && props.rankingIndex <=rankingEndIndex
}

const rankingClassObject = computed(() => ({
	'ranking-first': props.rankingIndex === 0 ? true : false,
	'ranking-second': props.rankingIndex === 1 ? true : false,
	'ranking-third': props.rankingIndex === 2 ? true : false
}))

</script>

<template>
	<div class="recipe-card">
		<RouterLink 
			class="router-link"
			@click="handleImgClick"
			:to="{
				name: 'recipe', 
				params: { id: props.linkId }
			}"
		>
			<div 
				class="recipe-card__ranking" 
				:class="rankingClassObject"
				v-if="isShowRanking()">
				{{ props.rankingIndex + 1 }}
			</div>
			<img class="recipe-card__keyvisual" 
				:src="props.imagePath" :alt="title"
				width="300px"
				height="200px"
			/>
		</RouterLink>
		<p class="recipe-card__title">
			{{ props.title }}
		</p>
	</div>
</template>

<style lang="css" scoped>
.recipe-card {
	border: solid 1px;
	border-color: rgba(0, 0, 0, 0.3);
	margin-top: 30px;
	position: relative;
}
.recipe-card__ranking {
	width: 72px;
	height: 40px;
	position: absolute;
	left: 10px;
	font-size: 24px;
	font-weight: bold;
	color: black;
	display: flex;
	justify-content: center;
	align-items: center;
}
.ranking-first {
	background-color: var(--ranking-first-color);
}
.ranking-second {
	background-color: var(--ranking-second-color);
}
.ranking-third {
	background-color: var(--ranking-third-color);
}
.recipe-card__title {
	text-align: center;
	font-size: 24px;
	margin-top: 0;
	margin-bottom: 0;
}
</style>
