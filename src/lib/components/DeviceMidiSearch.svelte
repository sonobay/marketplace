<script lang="ts">
	export let deviceId: string;
	let searchTerm = '';
</script>

<form
	on:submit|preventDefault={() => {
		if (searchTerm.length > 0) {
			window.location.href = `/devices/${deviceId}/search?query=${searchTerm}`;
		}
	}}
>
	<input
		type="text"
		placeholder="search..."
		aria-label="search for nfts"
		class="rounded-2xl w-full px-4 py-1 border border-charcoal bg-white focus:outline-none"
		bind:value={searchTerm}
	/>
</form>
