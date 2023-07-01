<script>
	import { scale } from 'svelte/transition';
	export let color = '#414141';
	export let width = '24px';
	export let height = '24px';
</script>

<svg in:scale xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.11 47.62" {width} {height}
	><path
		fill={color}
		d="m76.92,47.62c2.09-2.11,4.13-4.16,6.19-6.24C69.29,27.62,55.44,13.84,41.54,0,27.66,13.81,13.81,27.6,0,41.35c2.06,2.08,4.11,4.15,6.18,6.25,11.77-11.71,23.53-23.42,35.35-35.19,11.8,11.74,23.58,23.46,35.39,35.21Z"
	/></svg
>
