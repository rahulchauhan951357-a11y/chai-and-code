import { useEffect, useState } from "react";

function useCurrencyInfo(currency, { reload = 0 } = {}) {
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const isList = !currency || currency === "list" || currency === "all";

    setLoading(true);
    setError(null);

    const handleError = (err) => {
      if (err.name === "AbortError") return;
      const message = err.message || String(err);
      const status = err.status || null;
      setError({ message, status });
    };

    if (isList) {
      fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`,
        { signal }
      )
        .then((res) => {
          if (!res.ok)
            throw { message: res.statusText || "HTTP error", status: res.status };
          return res.json();
        })
        .then((res) => setCurrencies(res))
        .catch((err) => handleError(err))
        .finally(() => setLoading(false));
    } else {
      fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`,
        { signal }
      )
        .then((res) => {
          if (!res.ok)
            throw { message: res.statusText || "HTTP error", status: res.status };
          return res.json();
        })
        .then((res) => setRates(res[currency] || {}))
        .catch((err) => handleError(err))
        .finally(() => setLoading(false));
    }

    return () => controller.abort();
  }, [currency, reload]);

  return { rates, currencies, loading, error };
}

export default useCurrencyInfo;
