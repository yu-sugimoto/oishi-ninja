<script setup lang="ts">
import { ref } from 'vue'

interface Props {
	likeCount: number,
}

interface Emits {
	(event: 'good-button-click', status: 'like' | 'unlike'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const isClicked = ref(false)
const likeCountRef = ref(props.likeCount)

//TODO: 後で分ける
const handleButtonClick = () => {
	isClicked.value = !isClicked.value
	if (isClicked.value === true) {
		likeCountRef.value++
		emits('good-button-click', 'like')
	} else {
		likeCountRef.value--
		emits('good-button-click', 'unlike')
	}
}
</script>

<template>
		<button
			class="button-css-reset heart-button"
			:class="{ clicked: isClicked }"
			@click="handleButtonClick"
		>
			<div class="heart-mark" :class="{ clicked: isClicked }"></div>
		</button>
		<div 
			class="heart-count"
			:class="{ clicked: isClicked }">
			{{ likeCountRef }}
		</div>
</template>

<style lang="css" scoped>
.heart-button-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
}

.button-css-reset {
	display: flex;
  padding: 0;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
}

.heart-button {
	margin-top: 4px;
  width: 35px;
  height: 35px;
  position: relative;
  color: var(--color-light-gray);
  transition: color 0.3s ease;
}

/* isClickedがtrueのときピンク色に */
.heart-button.clicked,
.heart-count.clicked {
  color: var(--color-pink);
}
.heart-count {
	font-size: 12px;
  color: var(--color-light-gray);
	text-align: center;
}

.heart-button::before,
.heart-button::after {
  content: "";
  width: 50%;
	height: 78%;
  background: currentColor; /* 親のcolorを使用 */
  border-radius: 25px 25px 0 0;
  display: block;
  position: absolute;
}

.heart-button::before {
  transform: rotate(-45deg);
  left: 14%;
}

.heart-button::after {
  transform: rotate(45deg);
  right: 14%;
}
</style>
