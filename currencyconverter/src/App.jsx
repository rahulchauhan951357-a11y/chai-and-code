import React, { useEffect, useState } from 'react'
import InputBox from './components/InputBox'
import { useCurrencies, useRates } from './hooks/currency'


function App() {

	const { list: currencies = [], loading: listLoading, error: listError } = useCurrencies();
	const [amount, setAmount] = useState(1);
	const [from, setFrom] = useState("usd");
	const [to, setTo] = useState("inr");
	const [convertedAmount, setConvertedAmount] = useState(0);
	const [ratesReload, setRatesReload] = useState(0);

	// use reload counter when retry requested
	const { rates = {}, loading: ratesLoading, error: ratesError } = useRates(from, ratesReload);

	// ensure sensible defaults when the currencies list loads
	useEffect(() => {
		if (!currencies || currencies.length === 0) return;

		const codes = currencies.map((c) => c.code);
		if (!codes.includes(from)) {
			setFrom(codes.includes("usd") ? "usd" : codes[0]);
		}
		if (!codes.includes(to)) {
			// prefer INR when available, otherwise pick the first different currency
			setTo(codes.includes("inr") ? "inr" : codes.find((c) => c !== from) || codes[0]);
		}
	}, [currencies]);

	// prevent selecting same currency in both selects
	useEffect(() => {
		if (from === to) {
			const alt = currencies.find((c) => c.code !== from);
			if (alt) setTo(alt.code);
		}
	}, [from, currencies]);

	// reactive conversion whenever amount / rates / target change
	useEffect(() => {
		const rate = rates[to];
		if (rate) setConvertedAmount((Number(amount) || 0) * rate);
		else setConvertedAmount(0);
	}, [amount, rates, to]);

	// only show targets that have a rate for the selected base; fallback to all currencies
	const availableTargets = (currencies || []).filter((c) => rates && rates[c.code]);
	const toOptions = (availableTargets.length > 0 ? availableTargets : currencies).filter((c) => c.code !== from);

	// if chosen 'to' no longer available pick a valid one
	useEffect(() => {
		if (to && toOptions && !toOptions.some((c) => c.code === to)) {
			if (toOptions[0]) setTo(toOptions[0].code);
		}
	}, [rates, currencies]);

	const swap = () => {
		setFrom(to);
		setTo(from);
		setAmount(convertedAmount);
		setConvertedAmount(amount);
	};

	const convert = (e) => {
		e.preventDefault();
		// conversion already reactive; keep for compatibility
		const rate = rates[to];
		if (rate) setConvertedAmount((Number(amount) || 0) * rate);
	};

	const options = currencies;

	return (
		<div
			className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
			style={{
				backgroundImage: `url('https://images.pexels.com/photos/3532540/pexels-photo-3532540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
			}}
		>
			<div className="w-full">
				<div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
					<form
						onSubmit={convert}
					>
						{listLoading && <div>Loading currencies…</div>}
						{listError && <div className="text-red-600">Failed loading currencies</div>}

						<div className="w-full mb-1">
							<InputBox
								label="From"
								amount={amount}
								currency={from}
								options={options}
								onCurrencyChange={(currency) => setFrom(currency)}
								onAmountChange={(value) => setAmount(value)}
							/>
						</div>

						<div className="relative w-full h-0.5">
							<button
								type="button"
								className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
								onClick={swap}
							>
								swap
							</button>
						</div>

						<div className="w-full mt-1 mb-4">
							<InputBox
								label="To"
								amount={convertedAmount}
								currency={to}
								options={toOptions}
								onCurrencyChange={(currency) => setTo(currency)}
								amountDisable
							/>
						</div>

						<button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg">
							Convert {from.toUpperCase()} to {to.toUpperCase()}
						</button>

						{/* retry UI for rates */}
						<div className="mt-3">
							{ratesLoading && <div>Loading rates…</div>}

							{ratesError && (
								<div className="text-red-600">
									<div>Failed loading rates: {ratesError.message}{ratesError.status ? ` (status: ${ratesError.status})` : ''}</div>
									<button
										type="button"
										className="mt-2 bg-gray-200 px-3 py-1 rounded"
										onClick={() => setRatesReload((n) => n + 1)}
									>
										Retry rates
									</button>
								</div>
							)}

							{!ratesLoading && !ratesError && (!rates || !rates[to]) && (
								<div>
									Rate unavailable for {to.toUpperCase()}. Possible reasons: API doesn't return that pair or temporary outage.
									<button
										type="button"
										className="ml-2 bg-gray-200 px-2 py-1 rounded"
										onClick={() => setRatesReload((n) => n + 1)}
									>
										Retry
									</button>
								</div>
							)}

							{!ratesLoading && rates && rates[to] && (
								<div>
									{amount} {from.toUpperCase()} = {convertedAmount.toFixed(4)} {to.toUpperCase()}
								</div>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default App;