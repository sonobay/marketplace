<script>
	export let text = 'btn';
	export let href = '#';
	export let textColor = 'text-black';
	export let borderColor = 'border-black';
</script>

<a
	{href}
	class={'rounded-2xl px-4 py-1 bg-white border-2 text-center ' + textColor + ' ' + borderColor}
	>{text}</a
>
