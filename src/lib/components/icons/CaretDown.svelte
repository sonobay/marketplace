<script>
	import { scale } from 'svelte/transition';
	export let color = '#414141';
	export let width = '24px';
	export let height = '24px';
</script>

<svg in:scale|global {width} {height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.11 47.62" aria-hidden="true"
	><path
		fill={color}
		d="m76.92,0c2.09,2.11,4.13,4.16,6.19,6.24-13.82,13.76-27.67,27.54-41.57,41.38C27.66,33.81,13.81,20.02,0,6.27,2.06,4.19,4.11,2.12,6.18.02c11.77,11.71,23.53,23.42,35.35,35.19C53.33,23.47,65.11,11.75,76.92,0Z"
	/></svg
>
