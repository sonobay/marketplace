<script>
	export let text = 'btn';
	export let href = '#';
	export let textColor = 'text-black';
	export let borderColor = 'border-midiYellow';
</script>

<a
	{href}
	class={'rounded-2xl px-4 py-1 bg-midiYellow border-2 text-center ' +
		textColor +
		' ' +
		borderColor}>{text}</a
>
