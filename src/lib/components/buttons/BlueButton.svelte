<script>
	export let text = 'btn';
	export let disabled = false;
	export let action;
</script>

<button
	on:click={action}
	{disabled}
	class="shadow-md rounded-2xl px-4 py-1 bg-midiBlue border text-center border-charcoal disabled:opacity-60 hover:brightness-105 disabled:hover:brightness-100"
	>{text}</button
>
