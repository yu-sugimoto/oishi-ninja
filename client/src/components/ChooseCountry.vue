<script setup lang="ts">
import { ref, watch } from "vue";
import { AvailableCountryCode, AVALIABLE_COUNTRY_CODES, COUNTRY_NAME_BY_CODE, CountryCode } from "../constants/country.ts"
import { useCountryStore } from "../store/useCountryStore.ts"
import { countryCodeT } from "../type/countryType.ts";

const store = useCountryStore()
const selectedCountry = ref<countryCodeT | "">("")

const isEmptyString = (value: string): value is "" => {
	return value === ""
}

const countryOptions: { label: string, value: string}[] = []
for (const country of AVALIABLE_COUNTRY_CODES) {
	const value = country
	const label = COUNTRY_NAME_BY_CODE[country]
	countryOptions.push({ label, value })
}

function isAvailabelCountryCode(value: string): value is AvailableCountryCode {
	const countryCode = value as CountryCode
	return AVALIABLE_COUNTRY_CODES.includes(countryCode)
}

watch(selectedCountry, (newCountry) => {
	if (isEmptyString(newCountry)){
		return ;
	}

	if (!isAvailabelCountryCode(newCountry)) {
		console.error("Invalid country code")
		return ;
	}

	store.useSetCountry(newCountry)
})

</script>

<template>
	<div class="selector-wrapper">
		<select class="country-selector" v-model=selectedCountry >
			<option value="">国籍を選択</option>
			<option v-for="option in countryOptions" :key="option.value" :value="option.value" >
				{{ option.label }}
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
	border-radius: 10px;
}
</style>
