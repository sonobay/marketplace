<script lang="ts">
	import type { IPFSMetadata } from '$lib/types/ipfs-metadata';
	import type { UserToken } from '$lib/types/user-token';
	import { page } from '$app/stores';
	import Pack from '$lib/components/Pack.svelte';
	import { onMount } from 'svelte';
	import { providers } from 'ethers';

	export let data: { userTokens: UserToken[]; ipfs: Map<number, IPFSMetadata> };
	const { userTokens, ipfs } = data;
	const address = $page.params.address;
	import { environmentNetwork, truncateAddress } from '$lib/utils';
	import { variables } from '$lib/env';
	import Avatar from '$lib/components/Avatar.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let avatarPath: string | undefined;
	let ensName: string | null;
	let ensNameLoading = true;

	const etherscanBaseUrl =
		environmentNetwork()?.chainId === 1 ? `https://etherscan.io` : `https://goerli.etherscan.io`;

	onMount(() => {
		fetchEnsData();
	});

	// for testing with ENS data...
	// 0x280f3EdCDF23E5a645f55AdF143baAa177c214FB

	const fetchEnsData = async () => {
		ensNameLoading = true;
		const test = new providers.JsonRpcProvider(
			variables.infuraEndpoint,
			environmentNetwork()?.chainId
		);

		ensName = await test.lookupAddress(address);

		ensNameLoading = false;

		if (!ensName) {
			return;
		}

		const resolver = await test.getResolver(ensName);

		avatarPath = await resolver?.getText('avatar');
	};

	console.log(data);
</script>

<div>
	<div class="bg-gray-100 rounded-xl mb-8 h-64">
		{#if ensNameLoading}
			<div class="flex h-full justify-center items-center">
				<Spinner size={24} color="gray" />
			</div>
		{:else}
			<div class="flex px-8 py-4">
				<Avatar path={avatarPath} size={212} alt={ensName ?? address} />

				<div class="ml-4">
					<div class="flex flex-col">
						{#if ensName}
							<div class="flex items-end">
								<h2 class="text-2xl font-bold mr-4">{ensName}</h2>

								<a
									href={`${etherscanBaseUrl}/address/${address}`}
									target="_blank"
									rel="noreferrer"
									class="text-link">{truncateAddress(address)}</a
								>
							</div>
						{:else}
							<div>
								<h2 class="text-2xl font-bold">
									<a
										href={`${etherscanBaseUrl}/address/${address}`}
										target="_blank"
										rel="noreferrer"
										class="text-link">{truncateAddress(address)}</a
									>
								</h2>
							</div>
						{/if}

						<div class="mt-4 flex">
							<div
								class="flex flex-col w-24 h-24 justify-center items-center rounded-lg bg-white shadow mr-4"
							>
								<span>Packs</span>
								<span class="text-xl font-bold text-midiBlue">{userTokens.length}</span>
							</div>

							<div
								class="flex flex-col w-24 h-24 justify-center items-center rounded-lg bg-white shadow mr-4"
							>
								<span>Packs</span>
								<span class="text-xl font-bold text-midiBlue">{userTokens.length}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

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
