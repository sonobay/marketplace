<script lang="ts">
	import type { Listing } from "$lib/types/listing";
	import { buyItems, fetchAvailableAmount } from "$lib/utils/listing.contract";
  import { utils } from 'ethers'
	import Button from "./Button.svelte";
	import Dialog from "./Dialog.svelte";
  import { signer } from 'svelte-ethers-store'
  import { createEventDispatcher, onMount } from 'svelte';
  import type { BigNumber } from 'ethers'

  export let listing: Listing;
  export let name: string;

  const dispatch = createEventDispatcher();
  let dialogVisible = false;
  let purchaseProcessing = false;
  let availableAmount: BigNumber;
  $: amountToBuy = 1;

  const purchase = async () => {
    if (!signer) {
      return;
    }
    purchaseProcessing = true;

    const success = await buyItems({amount: amountToBuy, address: listing.listing, signer: $signer, price: listing.price}) 
    purchaseProcessing = false;
    if (success) {
      dispatch('purchaseComplete')
    }
  }

  const setAmountToBuy = (e: Event) => {
    const target = e.target as HTMLInputElement;
    amountToBuy = Math.ceil(+target.value)
  }

  const _fetchAvailableAmount = async () => {
    availableAmount = await fetchAvailableAmount(listing.listing)
  }

  onMount(() => {
    _fetchAvailableAmount()
  })

</script>

<div class="flex flex-col">
  <span>listing address: {listing.listing}</span>

  {#if availableAmount}
    <span>Available: {availableAmount.toString()}</span>
  {:else}
    <span>Available: ...</span>
  {/if}

  <span>Total Amount: {listing.amount}</span>
  <span>price: {utils.formatEther(listing.price)} ETH</span>
  <span>tokenId: {listing.tokenId}</span>
  <span>listed by user: {listing.user}</span>

  <!-- <button on:click|preventDefault={(_) => purchase()}>BUY</button> -->
  <Button on:click={() => dialogVisible = true} text="Buy" disabled={!$signer || !availableAmount || availableAmount?.isZero()} />
  {#if availableAmount?.isZero()}
    <span>SOLD OUT</span>
  {/if}

</div>

<!-- modal -->
<Dialog
  visible={dialogVisible} 
  on:close={() => dialogVisible = false} 
  headerText={`Buy ${name} @ ${utils.formatEther(listing.price)}`}
>
    <!-- Modal body -->
    <div class="p-6 space-y-6">
      <div class="mb-6">
        <div class="flex justify-between">
          <label for={`${listing.listing}-amountToBuy`} class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"># to buy</label>
        </div>
        <input type="number" value={amountToBuy} on:input={setAmountToBuy} id={`${listing.listing}-amountToBuy`} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
      </div>

      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        lorem ipsum about listing MIDI NFT
      </p>

      <div class="font-xl text-white">
        <span>Total:</span>
        <span>{amountToBuy ? utils.formatEther(listing.price.mul(amountToBuy)) : '0'} ETH</span>
      </div>

    </div>

    <!-- Modal footer -->
    <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
      <!-- <Button text="Approve" disabled={approvalIsLoading || isApproved} loading={approvalIsLoading} on:click={() => approve()} /> -->
      <Button on:click={(_) => purchase()} text="Buy MIDI" loading={purchaseProcessing} disabled={purchaseProcessing} />
    </div>
</Dialog>