import { error, redirect, type LoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;

	if (!id) {
		throw error(404, 'Device not found');
	}

	throw redirect(302, `/devices/${id}/listings`);
};
