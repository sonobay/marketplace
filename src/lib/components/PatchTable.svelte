<script lang="ts">
	import { sendMidiToOutput } from '$lib/stores/midi';
	import type { IPFSEntry, MintEntry } from '$lib/types/entry';
	import ImageRegular from './icons/ImageRegular.svelte';

	export let patches: Array<MintEntry> | Array<IPFSEntry>;
	export let removeButton: boolean = true;
	export let removePatch = (patch: MintEntry | IPFSEntry) => {};
</script>

<div>
	<h3 class="mb-2">Patches</h3>

	<table class="w-full">
		<thead>
			<tr>
				<th />
				<th class="text-left text-sm">Image</th>
				<th class="text-left text-sm">Name</th>
				<th class="text-left text-sm">Tags</th>
				<th />
			</tr>
		</thead>
		<tbody class="text-sm">
			{#each patches as patch, i}
				<tr class="border">
					<!-- patch number -->
					<td class="p-2">{i + 1}.</td>

					<!-- patch image -->
					<td class="p-2">
						{#if patch.image}
							<img
								src={typeof patch.image === 'string'
									? patch.image
									: URL.createObjectURL(patch.image)}
								alt={patch.name}
								class="w-8 h-8 object-cover rounded-md"
							/>
						{:else}
							<ImageRegular size={32} color="rgb(156 163 175)" />
						{/if}
					</td>

					<!-- patch name -->
					<td class="p-2">
						{patch.name.length > 12 ? patch.name.slice(0, 12) + '...' : patch.name}
					</td>

					<!-- patch tags -->
					<td class="p-2">
						<!-- {patch.tags.length > 1 ? patch.tags[0] + '...' : patch.tags[0] ?? ''} -->
						<div class="flex">
							{#each patch.tags as tag, i}
								<div class="flex mr-1">
									<span>#{tag}</span>
									<!-- add comma after tag, unless it is the last tag in the array -->
									{#if i < patch.tags.length - 1}
										<span>, </span>
									{/if}
								</div>
							{/each}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- <div class="bg-white p-6 rounded-2xl w-full text-xs ">
	{#each patches as patch, i}
		<div class="my-3 flex justify-between">
			<div class="flex gap-3 items-center w-2/6">
				<p class="w-4">{i + 1}.</p>
				{#if patch.image}
					<img
						src={typeof patch.image === 'string' ? patch.image : URL.createObjectURL(patch.image)}
						alt={patch.name}
						class="w-8 h-8 object-cover rounded-md"
					/>
				{:else}
					<ImageRegular size={32} color="rgb(156 163 175)" />
				{/if}

				<p class="">
					{patch.name.length > 12 ? patch.name.slice(0, 12) + '...' : patch.name}
				</p>
			</div>

			<p class="flex items-center text-left w-2/6">
				{patch.tags.length > 1 ? patch.tags[0] + '...' : patch.tags[0] ?? ''}
			</p>

			<div class="flex gap-3 w-2/6 justify-end">
				<button
					class="rounded-2xl px-4 py-1 bg-charcoal text-white text-center"
					on:click={() => {
						sendMidiToOutput(patch.midi ?? new Uint8Array(0));
					}}>SEND TO DEVICE</button
				>
				{#if removeButton}
					<button
						class="rounded-2xl px-4 py-1 bg-charcoal text-white text-center"
						on:click={() => {
							removePatch(patch);
						}}>DELETE</button
					>
				{/if}
			</div>
		</div>
	{/each}
</div> -->
