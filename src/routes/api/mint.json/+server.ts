import { json } from '@sveltejs/kit';
import { NFTStorage } from 'nft.storage';
import 'dotenv/config';
import sharp from 'sharp';
import { Blob } from '@web-std/blob';

interface Entry {
	name: string;
	midi: Uint8Array;
	image: Blob | undefined;
	tags: string[];
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export const POST = async ({ request }: { request: Request }) => {
	const { NFT_STORAGE_API_KEY } = process.env;
	const data = await request.formData(); // or .json(), or .text(), etc

	const name = data.get('name')?.toString();
	if (!name) {
		console.error('no name found');
		throw new Error(
			'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
		);
	}

	const logo = data.get('logo') as File;
	if (!logo) {
		throw new Error('No logo file found');
	}

	const ab = await logo.arrayBuffer();
	const buffer = Buffer.from(ab);
	const resizedLogo = await sharp(buffer).resize({ width: 500 }).webp().toBuffer();
	const blob = new Blob([resizedLogo]);
	const description = data.get('description')?.toString() ?? '';
	const device = data.get('device')?.toString();
	const manufacturer = data.get('manufacturer')?.toString() ?? '';

	if (!device || device.length <= 0) {
		throw new Error('No device set');
	}

	const entries: Entry[] = [];

	let i = 0;
	while (data.has(`entries[${i}].name`)) {
		const name = data.get(`entries[${i}].name`)?.toString() ?? '';
		const midi = data.has(`entries[${i}].midi`) ? data.get(`entries[${i}].midi`) : '';
		const image = data.has(`entries[${i}].image`)
			? (data.get(`entries[${i}].image`) as File)
			: undefined;
		let blob: Blob | undefined;

		const tags = data.has(`entries[${i}].tags`)
			? (JSON.parse(data.get(`entries[${i}].tags`) as string) as string[])
			: [];

		if (image) {
			const ab = await image?.arrayBuffer();
			const buffer = Buffer.from(ab);
			const resizedLogo = await sharp(buffer).resize({ width: 500 }).webp().toBuffer();
			blob = new Blob([resizedLogo]);
		}

		entries.push({ name, midi: JSON.parse(`[${midi?.toString() ?? ''}]`), image: blob, tags });

		i++;
	}

	if (!NFT_STORAGE_API_KEY) {
		console.error('no API_KEY found');
		throw new Error(
			'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
		);
	}

	if (!logo) {
		console.error('no image found');
		throw new Error(
			'@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)'
		);
	}

	const nft = {
		name,
		description,
		image: blob,
		properties: { device, manufacturer, entries }
	};

	const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
	const metadata = await client.store(nft);

	return json({
		metadata: metadata.url
	});
};
