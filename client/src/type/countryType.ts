import { COUNTRY_CODE } from '../constants/country.ts'

export type countryCodeT = typeof COUNTRY_CODE[keyof typeof COUNTRY_CODE];

