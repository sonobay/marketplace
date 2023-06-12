<script lang="ts">
	import { environmentNetwork, etherscanBaseUrl, truncateAddress } from '$lib/utils';
	import Avatar from './Avatar.svelte';
	import Spinner from './Spinner.svelte';
	import { providers } from 'ethers';
	import { environment } from '$lib/env';
	import { onMount } from 'svelte';

	export let address: string;

	let avatarPath: string | undefined;
	let ensName: string | null;
	let ensNameLoading = true;

	// for testing with ENS data...
	// 0x280f3EdCDF23E5a645f55AdF143baAa177c214FB
	const fetchEnsData = async () => {
		ensNameLoading = true;
		const provider = new providers.JsonRpcProvider(
			environment.providerEndpoint,
			environmentNetwork()?.chainId
		);

		ensName = await provider.lookupAddress(address);

		ensNameLoading = false;

		if (!ensName) {
			return;
		}

		const resolver = await provider.getResolver(ensName);

		avatarPath = await resolver?.getText('avatar');
	};

	onMount(() => {
		fetchEnsData();
	});
</script>

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
								href={`${etherscanBaseUrl(
									environmentNetwork()?.chainId ?? 137
								)}/address/${address}`}
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
						<!-- <div
							class="flex flex-col w-24 h-24 justify-center items-center rounded-lg bg-white shadow mr-4"
						>
							<span>Packs</span>
							<span class="text-xl font-bold text-midiBlue">{userTokens.length}</span>
						</div> -->

						<!-- <div
								class="flex flex-col w-24 h-24 justify-center items-center rounded-lg bg-white shadow mr-4"
							>
								<span>Packs</span>
								<span class="text-xl font-bold text-midiBlue">{userTokens.length}</span>
							</div> -->
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
