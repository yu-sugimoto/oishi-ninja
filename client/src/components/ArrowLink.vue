<script setup lang="ts">
interface Props {
  url?: string;
  to?: string;
  message?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <div v-if="props.url" class="link-wrapper">
    <a :href="props.url" class="link-container">
			<div class="triangle"></div>
      <span v-if="props.message">{{ props.message }}</span>
    </a>
  </div>
  <div v-else-if="props.to" class="link-wrapper">
    <RouterLink :to="props.to" class="link-container">
			<div class="triangle"></div>
      <span v-if="props.message">{{ props.message }}</span>
    </RouterLink>
  </div>
</template>

<style lang="css" scoped>
.link-container {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
	color: black;
	font-size: 16px;
}
.link-container:hover {
	text-decoration: underline var(--theme-color);
}
.triangle {
  height: 20px;
  aspect-ratio: cos(30deg);
  clip-path: polygon(100% 0,0 50%,100% 100%);
	background-color: var(--theme-color);

	margin-top: 20px;
	margin-right: 10px;
	margin-bottom: 20px;
	margin-left: 10px;
}

</style>
