<script setup lang="ts">
import { ref } from 'vue'

const isClicked = ref(false)
const count = ref(0)

interface Emits {
	(event: 'good-button-click'): void
}
const emits = defineEmits<Emits>()

//TODO: 後で分ける
const handleButtonClick = () => {
	isClicked.value = !isClicked.value
	if (isClicked.value === true) {
		count.value++
	} else {
		count.value--
	}
	emits('good-button-click')
}
</script>

<template>
	<button
		class="button-css-reset heart-button"
		:class="{ clicked: isClicked }"
		@click="handleButtonClick"
	>
		<div class="heart-mark" :class="{ clicked: isClicked }"></div>
		<span class="heart-count">{{ count }}</span>
	</button>
</template>

<style lang="css" scoped>
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

/* デフォルト色: D4D4D4 */
.heart-button {
	margin-top: 4px;
  width: 35px;  
  height: 35px; 
  position: relative;
  color: #D4D4D4; /* デフォルト色heart-button自体に付与 */
  transition: color 0.3s ease; /* 色変化にアニメーション */
}

/* isClickedがtrueのときピンク色に */
.heart-button.clicked {
  color: #E0548E;
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

.heart-count {
	position: absolute;
	top: 27px;
	left: 13px;
	font-size: 16px;
}
</style>
