<script lang="ts">
	export let userAddress: string;
	export let active: 'MINTED' | 'LISTINGS';

	const baseClass = 'border-2 mr-4 rounded-lg py-1 px-4 w-24 text-center';
	const inactiveClass = 'border-amber-500 text-amber-500 hover:bg-amber-100';
	const activeClass = 'bg-amber-500 text-white border-amber-500';
</script>

<div class="flex justify-between mb-4">
	<div class="flex">
		<a
			class={`${baseClass} ${active === 'LISTINGS' ? activeClass : inactiveClass}`}
			href={`/users/${userAddress}/listings`}>Listings</a
		>
		<a
			class={`${baseClass} ${active === 'MINTED' ? activeClass : inactiveClass}`}
			href={`/users/${userAddress}`}>All</a
		>
	</div>
</div>
