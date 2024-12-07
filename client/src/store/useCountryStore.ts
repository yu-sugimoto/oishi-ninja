import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import { readonly } from 'vue'
import type { countryCodeT } from '../type/countryType.ts'

export const useCountryStore = defineStore('country', () => {
	const countryName: Ref<countryCodeT | ''> = ref('')

	const useSetCountry = (newCountryName: countryCodeT | ''):void => {
		countryName.value = newCountryName
	}

	const getCountryName = (): countryCodeT | ''=> {
		return countryName.value
	}
	return { countryName, useSetCountry, getCountryName }
})

