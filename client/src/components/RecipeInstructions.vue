<script setup lang="ts">
interface Props {
	instructions: string,
}
const props = defineProps<Props>()
</script>

<template>
	<div class="recipe-instructions">
		{{ props.instructions }}
	</div>
</template>

<style lang="css" scoped>
.recipe-instructions {
	font-size: 16px;
}
</style>

