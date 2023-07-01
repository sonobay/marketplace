<script lang="ts">
	export let placeholder = 'Placeholder';
	export let max = 20;
	export let min = 2;
	export let number = false;
	export let onInputAction = (value: string) => {};
	export let value = '';
</script>

<input
	bind:value
	maxlength={max}
	minlength={min}
	class="rounded-xl border border-charcoal bg-transparent px-3 py-1 focus:outline-none w-full"
	on:input={() => {
		if (number) value = value.replace(/\D/g, '');
		onInputAction(value);
	}}
	{placeholder}
/>
