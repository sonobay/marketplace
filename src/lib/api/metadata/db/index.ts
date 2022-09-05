import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

export const get = async (id: string) => {};

/**
 * Store will be deprecated
 * @param id token id
 */
export const store = async (id: string) => {
	const { NFT_STORAGE_API_KEY, SUPABASE_URL, SUPABASE_KEY } = process.env;
	if (!SUPABASE_URL || !SUPABASE_KEY) {
		throw new Error('no supabase key or url found in env');
	}
	const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
};
