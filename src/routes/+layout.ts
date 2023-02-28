import { variables } from '$lib/env';
import type { Device } from '$lib/types/device';

export const load = async () => {
	const { apiEndpoint } = variables;

	const res = await fetch(`${apiEndpoint}/devices`);
	if (!res.ok) {
		throw new Error(`error fetching devices`);
	}
	const devices = (await res.json()) as Device[];

	return { devices };
};
