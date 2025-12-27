import useCurrencyInfo from "./useCurrencyInfo";

// Return list: [{code, name}, ...]
export function useCurrencies() {
	const { currencies = {}, loading, error } = useCurrencyInfo("list");
	const list = Object.entries(currencies).map(([code, name]) => ({ code, name }));
	return { list, loading, error };
}

// Accept a reload counter to force re-fetching
export function useRates(base, reload = 0) {
	const { rates = {}, loading, error } = useCurrencyInfo(base, { reload });
	return { rates, loading, error };
}