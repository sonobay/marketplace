<script lang="ts">
	let searchTerm = '';

	const handleSearch = () => {
		if (searchTerm.length < 3) {
			return;
		}

		console.log('searchTerm is: ', searchTerm);
	};
</script>

<div>
	<input bind:value={searchTerm} />

	<button disabled={searchTerm.length < 3} on:click={(_) => handleSearch()}>Search</button>
</div>
