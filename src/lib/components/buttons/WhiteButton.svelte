<script>
	export let textSize = 'text-base';
	export let action = () => {};
	export let disabled = false;
</script>

<button
	on:click={action}
	{disabled}
	class={'shadow-md rounded-2xl px-4 py-1 bg-white border-2 flex justify-center text-charcoal border-charcoal disabled:opacity-70 ' +
		textSize}
>
	<slot />
</button>
