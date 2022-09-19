<script lang="ts">
	import type { IPFSMetadata } from '$lib/types/ipfs-metadata';
  import type { BigNumber } from 'ethers'
	import Avatar from './Avatar.svelte';
  export let balance: BigNumber;
  export let metadata: IPFSMetadata | undefined;
  export let id: number;
</script>

<a class="flex border mb-2 items-center" href={`/midi/${id}`}>
  
  <Avatar path={metadata?.image} size="md" alt={metadata?.name ?? ''} />
  
  <div class="flex flex-col">
    <span>Name: {metadata?.name ?? '...'}</span>
    <span>Token ID: {id}</span>
    <span>Balance: {balance.toString()}</span>
  </div>
</a>