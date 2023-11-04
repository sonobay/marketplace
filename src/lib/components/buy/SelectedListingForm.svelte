<script lang="ts">
	import { isPositiveInteger } from '$lib/utils';
	import { utils, type BigNumber } from 'ethers';
	import YellowButton from '../buttons/YellowButton.svelte';
	import { createEventDispatcher } from 'svelte';

	export let availableAmount: BigNumber;
	export let price: BigNumber;
	export let purchaseAmount: number;
	export let formDisabled: boolean;

	let displayPurchaseAmount = '1';
	const dispatch = createEventDispatcher();

	const labelClass = 'text-xs text-gray-500 font-bold';

	const validatePurchaseAmount = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;

		// empty string
		if (target.value === '') {
			displayPurchaseAmount = '';
			purchaseAmount = 0;
			return;
		}

		// ensure the value is a number
		if (!isPositiveInteger(target.value)) {
			displayPurchaseAmount = '';
			return;
		}

		// ensure the value is less than the available amount
		if (+value > availableAmount.toNumber()) {
			displayPurchaseAmount = '';
			return;
		}

		displayPurchaseAmount = value;
		purchaseAmount = +value;
	};
</script>

<div>
	<!-- Amount -->
	<div class="flex flex-col mb-4">
		<label class={labelClass} for="amount">Amount</label>
		<input
			type="number"
			id="purchase-amount"
			name="purchase-amount"
			min="1"
			max={availableAmount.toNumber()}
			bind:value={displayPurchaseAmount}
			on:input={validatePurchaseAmount}
			class="rounded border border-gray-300 p-2"
		/>
	</div>
	<!-- Total Price Display -->
	<div class="flex flex-col mb-4">
		<span class={labelClass}>Total Price</span>
		<span>{utils.formatEther(price.mul(purchaseAmount))} ETH</span>
	</div>

	<div class="flex flex-col">
		<YellowButton action={() => dispatch('submitPurchase')} disabled={formDisabled}
			>Buy</YellowButton
		>
	</div>
</div>
