<script lang="ts">
	import Input from './inputs/Input.svelte';

	export let deviceId: string;
	let searchTerm = '';
</script>

<div class="flex bg-gray-100 py-4 px-4 rounded-lg mb-4">
	<Input id="deviceSearch" name="deviceSearch" bind:value={searchTerm} />

	<a
		class="bg-midiBlue hover:bg-midiBlueLink text-white h-9 px-4 rounded flex items-center w-36 justify-center ml-4"
		href={`/devices/${deviceId}/search?query=${searchTerm}`}>Search</a
	>
</div>
