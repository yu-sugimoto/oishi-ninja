<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { COUNTRY_CODE } from './constants/country';
import { getRecipeRankingByCountryCode } from './services/api';

async function requestRankingExample () {
  console.log('ランキングの取得を開始します');
  const ranking = await getRecipeRankingByCountryCode(COUNTRY_CODE.JPN);
  console.log('ランキングの取得が完了しました');
  console.log(ranking);
}
requestRankingExample()
</script>

<template>
	<NavBar/>
	<RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
