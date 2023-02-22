<script lang="ts">
	import { sendMidiToOutput } from '$lib/stores/midi';
	import type { Entry } from '$lib/types/entry';
	import { createEventDispatcher } from 'svelte';
	import ImageRegular from './icons/ImageRegular.svelte';

	export let entries: Entry[];
	const tdClass = 'px-2';
	const btnClass =
		'w-full text-gray-400 border-2 border-gray-400 hover:bg-gray-100 rounded-xl py-1 text-xs uppercase';

	const dispatch = createEventDispatcher<{ removeEntry: { index: number } }>();
</script>

{#if entries.length > 0}
	<div class="rounded-lg border bg-gradient-to-b p-0.5 from-gray-300 to-gray-400">
		<div class="bg-white rounded px-4 py-4">
			<table class="w-full border-collapse">
				<tbody>
					{#each entries as entry, i}
						<tr>
							<td class="py-3">{i + 1}.</td>
							<td class={tdClass}>
								{#if entry.image}
									<img
										class="w-8 rounded"
										src={URL.createObjectURL(entry.image[0])}
										alt="Device Logo"
									/>
								{:else}
									<ImageRegular size={32} color="rgb(156 163 175)" />
								{/if}
							</td>
							<td class={tdClass}>{entry.name}</td>
							<td class={`${tdClass}`}>
								<div class="flex">
									{#each entry.tags as tag, i}
										<span>#{tag}</span>
										{#if i < entry.tags.length - 1}
											<span class="mr-1">,</span>
										{/if}
									{/each}
								</div>
							</td>
							<td class={tdClass}>
								<button
									class={`${btnClass} px-1`}
									on:click|preventDefault={(_) => sendMidiToOutput(entry.midi ?? new Uint8Array(0))}
									>Send To Device</button
								>
							</td>
							<td class={`${tdClass} w-12`}>
								<button
									class={`${btnClass} px-6`}
									on:click|preventDefault={(_) => dispatch('removeEntry', { index: i })}
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<div
		class="rounded-xl bg-amber-100 text-amber-500 border-2 border-amber-500 text-center w-full py-8"
	>
		Add Patches
	</div>
{/if}
