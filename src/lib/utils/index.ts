const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export const truncateAddress = (address: string) => {
	const match = address.match(truncateRegex);
	if (!match) return address;
	return match[1] + '\u2026' + match[2];
};

export const isNumber = (n: string) => !isNaN(parseFloat(n));

export const isPositiveInteger = (n: string) => {
	if (!isNumber(n)) {
		return false;
	}
	return +n >>> 0 === parseFloat(n);
};
