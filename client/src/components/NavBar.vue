<script setup lang="ts">
import appIcon from '../assets/app_icon.png'

</script>
<template>
	<nav class="nav">
		<RouterLink to="/" class="nav__home-link">Oishi Ninja</RouterLink>
		<img :src="appIcon" alt="app icon" width="54px" height="46px"/>
	</nav>
</template>
<style lang="css" scoped>
.nav {
	display: flex;
	height: 80px;
	text-align: center;
	align-content: center;
	align-items: center;
	justify-content: center;
	background-color: var(--theme-color);
}
.nav__home-link {
	font-size: 32px;
	text-decoration: none;
	color: black;
	font-weight: bold;
}
	
</style>
