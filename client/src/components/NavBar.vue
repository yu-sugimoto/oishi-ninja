<script setup lang="ts">
import appIcon from '../assets/app_icon.png'

interface Props {
	flagPath?: string
}

const props = defineProps<Props>()

</script>
<template>
	<nav class="nav">
		<div class="flag-margin">
			<img class="flag" v-if="props.flagPath" :src="props.flagPath" alt="country flag"/>
		</div>
		<div class="logo-and-link">
			<RouterLink to="/" class="nav__home-link">Oishi Ninja</RouterLink>
			<img :src="appIcon" alt="app icon" width="54px" height="46px"/>
		</div>
	</nav>
</template>
<style lang="css" scoped>
.nav {
	display: flex;
	height: 80px;
	text-align: center;
	align-content: center;
	align-items: center;
	background-color: var(--theme-color);
}
.flag-margin {
	width: 110px;
	height: 30px;
}
.flag {
	width: 50px;
	height: 30px;
}
.logo-and-link {
	display: flex;
	align-items: center;
	justify-content: center;
}
.nav__home-link {
	font-size: 32px;
	text-decoration: none;
	color: black;
	font-weight: bold;
}
	
</style>
