<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import YellowButton from '../buttons/YellowButton.svelte';

	export let amount: number;
	export let packName: string;

	const dispatch = createEventDispatcher();
</script>

<div>
	<div class="flex flex-col mb-4">
		<span class="text-2xl font-bold">Congrats 🥳</span>
		<span class="text-sm mb-2 text-gray-500">You have purchased:</span>
		<div>
			<span class="font-bold">{amount}</span> pack{amount <= 1 ? '' : 's'} of
			<span class="font-bold">{packName}</span>
		</div>
	</div>

	<YellowButton action={() => dispatch('close')}>Done</YellowButton>
</div>
