<script setup lang="ts">

interface Props {
	linkPageName: string
	linkId: string,
	rankingNum: number,
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

</script>

<template>
	<div class="recipe-card">
		<RouterLink 
			@click="handleImgClick"
			:to="{
				name: 'recipe', 
				params: { id: props.linkId }
			}"
		>
			<img class="recipe-card__keyvisual" :src="props.imagePath" :alt="title" />
		</RouterLink>
		<p class="recipe-card__title">
			{{ props.title }}
		</p>
	</div>
</template>

<style lang="css" scoped>

</style>
