<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	import { chainId } from 'svelte-ethers-store';
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { environmentNetwork, promptSwitchNetwork } from '$lib/utils';

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

<Header />

<main class="container mx-auto py-12 px-4">
	<slot />
</main>
