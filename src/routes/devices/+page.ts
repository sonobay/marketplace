import { environment } from '$lib/env';
import type { Device } from '$lib/types/device';
import type { LoadEvent } from '@sveltejs/kit';

export const load = async ({ fetch }: LoadEvent) => {
	const { apiEndpoint } = environment;

	const res = await fetch(`${apiEndpoint}/devices`);
	const devices = (await res.json()) as Device[];

	return { devices };
};
