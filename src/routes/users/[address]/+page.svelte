<script lang="ts">

  import type { BigNumber } from 'ethers';
  export let data: {userTokens: {tokenID: number, balance: BigNumber}[]};
  const {userTokens} = data;

</script>

<div>
  {#if userTokens}
    {#each userTokens as userToken}
    <a href={`/midi/${userToken.tokenID}`} class="flex flex-col border mb-2">
      <div>TOKEN_ID: {userToken.tokenID}</div>
      <div>BALANCE: {userToken.balance}</div>
    </a>
    {/each}
  {/if}
</div>