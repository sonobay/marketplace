<script>
	export let text = 'btn';
	export let textSize = 'text-base';
	export let action = () => {};
</script>

<button
	on:click={action}
	class={'rounded-2xl px-4 py-1 bg-white border-2 text-center text-charcoal border-charcoal ' +
		textSize}>{text}</button
>
