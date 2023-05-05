import type { LoadEvent } from '@sveltejs/kit';
import { midi } from '@sonobay/sdk';
import { envChainId } from '$lib/utils';

export const load = async ({ params }: LoadEvent) => {
	const { id } = params;
	if (!id) {
		throw new Error('No ID found');
	}

	const _midi = await midi({ chainId: envChainId() }).fetchOne({ id: +id });

	return { midi: _midi };
};
