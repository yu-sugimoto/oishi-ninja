import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
//import type { countryCodeT } from '../type/countryType.ts'
import type { AvailableCountryCode } from '../constants/country.ts'

export const useCountryStore = defineStore('country', () => {
	const countryName: Ref<AvailableCountryCode | ''> = ref('')

	const useSetCountry = (newCountryName: AvailableCountryCode | ''):void => {
		countryName.value = newCountryName
	}

	const getCountryName = (): AvailableCountryCode | ''=> {
		return countryName.value
	}
	return { countryName, useSetCountry, getCountryName }
})
