import { NFTStorage } from 'nft.storage';
import 'dotenv/config';
import sharp from 'sharp';
import { Blob } from '@web-std/blob';
// import type { Entry } from '$lib/types/entry';

interface Entry {
	name: string;
	midi: Uint8Array;
	image: Blob | undefined;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const data = await request.formData(); // or .json(), or .text(), etc

	console.log('data is: ', data);

	const name = data.get('name')?.toString();
	if (!name) {
		console.error('no name found');
		return handleError('No name found');
	}
	console.log('name is: ', name);

	// const keys = data.keys();
	// console.log('keys are: ', keys);
	for (const key of data.keys()) {
		console.log('key is: ', key);
	}

	const logo = data.get('logo') as File;
	console.log('logo is: ', logo);
	if (!logo) {
		console.log('no logo wtf');
	}

	const ab = await logo.arrayBuffer();
	const buffer = Buffer.from(ab);
	const resizedLogo = await sharp(buffer).resize({ width: 500 }).webp().toBuffer();
	const blob = new Blob([resizedLogo]);

	// if (!test) {
	// 	console.error('no image found');
	// 	return handleError('No image found');
	// }

	const description = data.get('description')?.toString() ?? '';
	// const entries = data.get('entries')?.toString() ?? '';

	// console.log('entries are: ', entries);

	const entries: Entry[] = [];

	let i = 0;
	while (data.has(`entries[${i}].name`)) {
		const name = data.get(`entries[${i}].name`)?.toString() ?? '';
		const midi = data.has(`entries[${i}].midi`) ? data.get(`entries[${i}].midi`)?.toString() : '';
		const image = data.has(`entries[${i}].image`)
			? (data.get(`entries[${i}].image`) as File)
			: undefined;
		let blob: Blob | undefined;

		if (image) {
			const ab = await image?.arrayBuffer();
			const buffer = Buffer.from(ab);
			const resizedLogo = await sharp(buffer).resize({ width: 500 }).webp().toBuffer();
			blob = new Blob([resizedLogo]);
		}

		// const image = undefined;

		console.log('image is: ', image);

		const test = new TextEncoder().encode(midi);

		// const test = new Uint8Array(midi?.toString().length)

		entries.push({ name, midi: test, image: blob });

		i++;
	}

	const API_KEY = process.env.NFT_STORAGE_API_KEY;

	if (!API_KEY) {
		console.error('no API_KEY found');
		return handleError('No API KEY present');
	}

	if (!logo) {
		console.error('no image found');
		return handleError('No image found');
	}

	const nft = {
		name,
		description,
		image: blob,
		properties: { entries }
	};

	const client = new NFTStorage({ token: API_KEY });
	const metadata = await client.store(nft);

	console.log('metadata is: ', metadata);

	return {
		status: 200,
		body: {
			metadata
		}
	};
}

const handleError = (msg: string) => ({
	status: 500,
	body: {
		error: new Error(msg)
	}
});
