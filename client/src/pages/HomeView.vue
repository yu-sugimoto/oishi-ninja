<script setup lang="ts">
import ChooseCountry from "../components/ChooseCountry.vue";
import NavBar from "../components/NavBar.vue";

</script>
<template>
	<NavBar/>
	<main>
		<h1 class="title">
			あなたの好きな<br/>
			日本食が見つかる
		</h1>
	<ChooseCountry />
	<div class="router-link-wrapper">
		<RouterLink class="go-to-ranking-link" to="/ranking">Go Recipe!</RouterLink>
	</div>
	</main>
</template>

<style lang="css" scoped>
.title {
	font-size: 32px;
	font-weight: bold;
	color: #FF5811;
	text-align: center;
}
.router-link-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 20px;
}
.go-to-ranking-link {
	width: 178px;
	height: 56px;
	background-color: var(--theme-color);
	border-radius: 10px;
	font-size: 24px;
	font-weight: bold;
	text-decoration: none;
	color: black;

	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
