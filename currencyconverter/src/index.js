import React, { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import InputBox from "./components/InputBox";
import { useCurrencies, useRates } from "./hooks/currency";

function App() {
	const { list: currencies, loading: listLoading, error: listError } = useCurrencies();
	const [base, setBase] = useState("usd");
	const [target, setTarget] = useState("nar");
	const [amount, setAmount] = useState(1);

	const { rates, loading: ratesLoading, error: ratesError } = useRates(base);

	// When currencies list loads ensure base/target exist; if not, pick defaults
	useEffect(() => {
		if (!currencies || currencies.length === 0) return;

		const hasBase = currencies.some((c) => c.code === base);
		if (!hasBase) setBase(currencies[0].code);

		const hasTarget = currencies.some((c) => c.code === target);
		if (!hasTarget) {
			const firstOther = currencies.find((c) => c.code !== base);
			if (firstOther) setTarget(firstOther.code);
		}
	}, [currencies]);

	// If user selects base equal to target, pick a different target automatically
	useEffect(() => {
		if (!currencies) return;
		if (base === target) {
			const alt = currencies.find((c) => c.code !== base);
			if (alt) setTarget(alt.code);
		}
	}, [base, currencies]);

	const currencyOptions = useMemo(
		() => (currencies || []).filter((c) => c.code !== (base === undefined ? "" : undefined)),
		[currencies, base]
	);

	// compute conversion
	const rate = rates ? rates[target] : undefined;
	const converted = rate ? parseFloat(amount || 0) * rate : null;

	return (
		<div style={{ fontFamily: "sans-serif", padding: 20, maxWidth: 520, margin: "0 auto" }}>
			<h2>Currency Exchanger</h2>

			{listLoading && <div>Loading currencies…</div>}
			{listError && <div style={{ color: "red" }}>Failed loading currencies</div>}

			{!listLoading && currencies && (
				<>
					<InputBox
						label="From"
						amount={amount}
						onAmountChange={(v) => setAmount(v)}
						currency={base}
						onCurrencyChange={(v) => setBase(v)}
						options={currencies}
					/>

					<InputBox
						label="To"
						amount={converted !== null ? converted : ""}
						onAmountChange={() => {}}
						currency={target}
						onCurrencyChange={(v) => setTarget(v)}
						options={currencies.filter((c) => c.code !== base)}
					/>

					<div style={{ marginTop: 12 }}>
						{ratesLoading && <div>Loading rates…</div>}
						{ratesError && <div style={{ color: "red" }}>Failed loading rates</div>}
						{rate ? (
							<div>
								{amount} {base.toUpperCase()} = {converted.toFixed(4)} {target.toUpperCase()}
							</div>
						) : (
							<div>Rate unavailable for {target.toUpperCase()}</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

// Render
const root = createRoot(document.getElementById("root") || document.body.appendChild(document.createElement("div")));
root.render(<App />);
