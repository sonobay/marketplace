<script lang="ts">
	import type { IPFSMetadata } from '$lib/types/ipfs-metadata';
	import type { UserToken } from '$lib/types/user-token';
	import { page } from '$app/stores';
	import Pack from '$lib/components/Pack.svelte';
	import UserInfoHeaderSection from '$lib/components/UserInfoHeaderSection.svelte';
	import UserSubNav from '$lib/components/UserSubNav.svelte';

	export let data: { userTokens: UserToken[]; ipfs: Map<number, IPFSMetadata> };
	const { userTokens, ipfs } = data;
	const address = $page.params.address;

	console.log(data);
</script>

<div>
	<UserInfoHeaderSection {address} />

	<UserSubNav userAddress={address} active="MINTED" />

	{#if userTokens && userTokens.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
			{#each userTokens as userToken}
				<a class="flex justify-left" href={`/midi/${userToken.id}`}>
					<Pack
						name={ipfs.get(userToken.id)?.name ?? '-'}
						image={ipfs.get(userToken.id)?.image}
						entries={ipfs.get(userToken.id)?.properties.entries ?? []}
						numberMinted={userToken.balance.toNumber()}
					/>
				</a>
			{/each}
		</div>
	{:else}
		<div
			class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
		>
			No Packs Found
		</div>
	{/if}
</div>
