<script>
	import { scale } from 'svelte/transition';
	export let color = '#414141';
	export let width = '24px';
	export let height = '24px';
</script>

<svg
	in:scale
	id="Layer_1"
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 93.42 75.77"
	{width}
	{height}
	><path d="m93.4,15.06H.07V0h93.33v15.06Z" fill={color} /><path
		fill={color}
		d="m93.42,60.63v14.96c-.59.19-91.99.25-93.27.08-.16-.58-.21-13.93-.05-15.04h93.32Z"
	/><path d="m.07,30.31h93.32v14.96c-.6.16-92.18.22-93.32.05v-15.01Z" fill={color} /></svg
>
