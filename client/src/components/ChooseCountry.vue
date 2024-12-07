<script setup lang="ts">
import { ref, watch } from "vue";
import { COUNTRY_CODE } from "../constants/country.ts"
import { useCountryStore } from "../store/useCountryStore.ts"
import { countryCodeT } from "../type/countryType.ts";

const store = useCountryStore()
const selectedCountry = ref<countryCodeT | "">("")

const isEmptyString = (value: string): value is "" => {
	return value === ""
}

watch(selectedCountry, (newCountry) => {
	if (isEmptyString(newCountry)){
		return ;
	}
	store.useSetCountry(newCountry)
})

</script>

<template>
	<div class="selector-wrapper">
		<select class="country-selector" v-model=selectedCountry >
			<option value="">国籍を選択</option>
			<option v-for="country in COUNTRY_CODE" :key="country" :value="country" >
				{{ country }}
			</option>
		</select>
	</div>
</template>

<style lang="css" scoped>
.selector-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
}
.country-selector {
	height: 56px;
	width: 315px;
	font-size: 24px;
	font-weight: bold;
	text-align: center;
	background-color: var(--selectbox-color);
}
</style>

