<script>
	export let disabled = false;
	export let action = () => {};
</script>

<button
	on:click={action}
	{disabled}
	class="shadow-md flex justify-center rounded-2xl px-4 py-1 bg-midiYellow border border-2 text-center border-charcoal disabled:opacity-70 hover:brightness-105 disabled:hover:brightness-100"
>
	<slot />
</button>
