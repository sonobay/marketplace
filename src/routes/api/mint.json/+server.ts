import { json, error } from '@sveltejs/kit';
import { NFTStorage, File, Blob } from 'nft.storage';
import 'dotenv/config';
import sharp from 'sharp';
import { clearImageExtensions } from '$lib/utils';

interface Entry {
	name: string;
	midi: Uint8Array;
	image: Blob | undefined;
	tags: string[];
}

const fileToBlob = async (file: File) => {
	const ab = await file.arrayBuffer();
	const buffer = Buffer.from(ab);
	const resizedLogo = await sharp(buffer).resize({ width: 500 }).webp().toBuffer();
	return new Blob([resizedLogo], {
		type: 'image/webp'
	});
};

/** @type {import('@sveltejs/kit').RequestHandler} */
export const POST = async ({ request }: { request: Request }) => {
	const { NFT_STORAGE_API_KEY } = process.env;

	if (!NFT_STORAGE_API_KEY) {
		throw error(500, 'No NFT_STORAGE_API_KEY found');
	}

	const data = await request.formData(); // or .json(), or .text(), etc

	const name = data.get('name')?.toString();

	if (!name) {
		return json({ message: 'No name provided' }, { status: 400 });
	}

	const logo = data.get('logo') as File;
	if (!logo) {
		return json({ message: 'No logo file found' }, { status: 400 });
	}

	const image = await fileToBlob(logo);
	const description = data.get('description')?.toString() ?? '';
	const packTags = JSON.parse(data.get('packTags')?.toString() ?? '[]');

	const devices = JSON.parse(data.get('devices')?.toString() ?? '[]');

	if (!devices || devices.length <= 0) {
		return json({ message: 'No devices set' }, { status: 400 });
	}

	const entries: Entry[] = [];

	let i = 0;
	while (data.has(`entries[${i}].name`)) {
		const name = data.get(`entries[${i}].name`)?.toString() ?? '';
		const midi = data.has(`entries[${i}].midi`) ? data.get(`entries[${i}].midi`) : '';
		const image = data.has(`entries[${i}].image`)
			? (data.get(`entries[${i}].image`) as File)
			: undefined;
		let entryImage: Blob | undefined;

		const tags = data.has(`entries[${i}].tags`)
			? (JSON.parse(data.get(`entries[${i}].tags`) as string) as string[])
			: [];

		if (image) {
			entryImage = await fileToBlob(image);
		}

		entries.push({
			name,
			midi: JSON.parse(`[${midi?.toString() ?? ''}]`),
			image:
				entryImage && image
					? new File([entryImage], `${clearImageExtensions(image.name)}.webp`, {
							type: 'image/webp'
					  })
					: undefined,
			tags
		});

		i++;
	}

	const nft = {
		name,
		description,
		image: new File([image], `${clearImageExtensions(logo.name)}.webp`, {
			type: 'image/webp'
		}),
		properties: { devices, entries, tags: packTags }
	};

	console.log('NFT_STORAGE_API_KEY: ', NFT_STORAGE_API_KEY);

	const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });

	try {
		const metadata = await client.store(nft);
		return json({
			metadata: metadata.url
		});
	} catch (err) {
		return json({ message: err }, { status: 500 });
	}
};
