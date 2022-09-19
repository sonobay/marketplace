<script lang="ts">
	import type { UserToken } from '$lib/types/user-token';
  export let data: {userTokens: UserToken[]};
  const {userTokens} = data;

</script>

<div>
  {#if userTokens}
    {#each userTokens as userToken}
    <a href={`/midi/${userToken.id}`} class="flex flex-col border mb-2">
      <div>TOKEN_ID: {userToken.id}</div>
      <div>BALANCE: {userToken.balance}</div>
    </a>
    {/each}
  {/if}
</div>