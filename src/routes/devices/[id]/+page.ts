import { error, type LoadEvent } from '@sveltejs/kit';
import { devices } from '@sonobay/sdk';
import { envChainId } from '$lib/utils';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;

	if (!id) {
		throw error(404, 'Device not found');
	}

	const _device = await devices({ chainId: envChainId() }).fetchOne({ id });

	return { device: _device };
};
