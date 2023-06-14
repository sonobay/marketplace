<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	import { chainId } from 'svelte-ethers-store';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { environmentNetwork, promptSwitchNetwork } from '$lib/utils';
	import type { Device } from '$lib/types/device';

	export let data: { devices: Device[] };
	const { devices } = data;

	const correctNetwork = environmentNetwork();
	let unsubscriber: Unsubscriber = () => {};

	onMount(() => {
		unsubscriber = chainId.subscribe((id) => {
			if (!correctNetwork || !id) {
				return;
			}

			if (+id !== +correctNetwork?.chainId) {
				promptSwitchNetwork(correctNetwork);
			}
		});
	});

	onDestroy(unsubscriber);
</script>

<Header {devices} />

<main class="container mx-auto py-8 px-4 text-charcoal">
	<slot />
</main>
