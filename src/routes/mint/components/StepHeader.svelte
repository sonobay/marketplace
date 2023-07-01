<script>
	import CircleCheck from '$lib/components/icons/CircleCheck.svelte';

	export let blue = false;
	export let text = '';
</script>

<div class="flex items-center">
	<CircleCheck color={blue ? 'rgb(110 198 255)' : 'rgb(255 221 87)'} />
	<p
		class={'text-xs text-left md:text-base ml-2  ' +
			(blue ? 'font-bold text-midiBlue ' : 'text-midiGray')}
	>
		{text}
	</p>
</div>
