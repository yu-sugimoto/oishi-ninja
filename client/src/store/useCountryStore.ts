import { defineStore } from "pinia";
import { ref, Ref } from "vue";
import type { AvailableCountryCode } from "../constants/flags";

export const useCountryStore = defineStore("country", () => {
  const countryName: Ref<AvailableCountryCode | ''> = ref('');

  const useSetCountry = (newCountryName: AvailableCountryCode | ''): void => {
    countryName.value = newCountryName;
  };

  const getCountryName = (): AvailableCountryCode | '' => {
    return countryName.value;
  };

  const loadFromLocalStorage = () => {
    const storedValue = localStorage.getItem("countryStore");
    if (storedValue) {
      const parsed = JSON.parse(storedValue);
      if (parsed && parsed.countryName) {
        countryName.value = parsed.countryName as AvailableCountryCode;
      }
    }
  };

  return { countryName, useSetCountry, getCountryName, loadFromLocalStorage };
}, {
  persist: {
    key: "countryStore", // Key for localStorage
    storage: window.localStorage, // Use localStorage
  },
});
