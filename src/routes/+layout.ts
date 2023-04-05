import { variables } from '$lib/env';
import type { Device } from '$lib/types/device';

export const load = async () => {
	const { apiEndpoint } = variables;

	console.log('fetching devices...');

	const res = await fetch(`${apiEndpoint}/devices`);
	if (!res.ok) {
		throw new Error(`error fetching devices`);
	}
	const devices = (await res.json()) as Device[];

	console.log('returning devices...');

	return { devices };
};
