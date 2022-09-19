<script lang="ts">
	import NftListItem from '$lib/components/NFTListItem.svelte';
  import type { IPFSMetadata } from '$lib/types/ipfs-metadata';
	import type { UserToken } from '$lib/types/user-token';
  import { page } from '$app/stores';
  export let data: {userTokens: UserToken[], ipfs: Map<number, IPFSMetadata>};
  const {userTokens, ipfs} = data;
  const address = $page.params.address

</script>

<div>

  <h1>User: {address}</h1>

  {#if userTokens}
    {#each userTokens as userToken}
    <NftListItem metadata={ipfs.get(userToken.id)} id={userToken.id} balance={userToken.balance} />
    {/each}
  {/if}
</div>