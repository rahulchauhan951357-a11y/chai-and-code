import React from "react";

export default function InputBox({
	amount,
	onAmountChange,
	currency,
	onCurrencyChange,
	options = [],
	label,
}) {
	return (
		<div style={{ marginBottom: 12 }}>
			<label style={{ display: "block", marginBottom: 6 }}>{label}</label>
			<div style={{ display: "flex", gap: 8 }}>
				<input
					type="number"
					min="0"
					step="any"
					value={amount}
					onChange={(e) => onAmountChange(e.target.value)}
					style={{ flex: 1, padding: "6px 8px" }}
				/>
				<select value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
					{options.map((opt) => (
						<option key={opt.code} value={opt.code}>
							{opt.code.toUpperCase()} — {opt.name}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
