<script lang="ts">
	import { midi } from '$lib/stores/midi';
	import { onDestroy } from 'svelte';
	import {headerCSS} from '$lib/stores/header.js';
	import { onMount } from 'svelte';

	onMount(() => {
		$headerCSS = "text-black before:bg-black";
	})
	
	let inputs: WebMidi.MIDIInput[] = [];
	let outputs: WebMidi.MIDIOutput[] = [];

	let selectedInput: WebMidi.MIDIInput | undefined;
	$: selectedInput;

	let selectedOutput: WebMidi.MIDIOutput | undefined;
	$: selectedOutput;

	const unsubscribe = midi.subscribe((store) => {
		inputs = [];
		outputs = [];

		if (!store.inputs || store.inputs.size <= 0) {
			selectedInput = undefined;
			return;
		} else {
			for (const input of store.inputs) {
				inputs.push(input[1]);
			}
		}

		if (!store.outputs || store.outputs.size <= 0) {
			selectedOutput = undefined;
			return;
		} else {
			for (const output of store.outputs) {
				outputs.push(output[1]);
			}
		}

		selectedInput = store.selectedInput;
		selectedOutput = store.selectedOutput;
	});

	onDestroy(unsubscribe);
</script>

<section class="pt-32 px-4 flex justify-center">
	<div class="container">
		<h1 class="mb-4">MIDI Settings</h1>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<h2>Inputs</h2>
				<ul>
					{#each inputs as input}
						<li class="flex items-center">
							<button
								on:click={(_) => midi.selectInput(input)}
								class={`hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-charcoal before:absolute before:left-0 before:bottom-0 ${
									selectedInput?.id === input.id ? 'font-bold' : ''
								}`}>{input.manufacturer}: {input.name}</button
							>
						</li>
					{/each}
				</ul>
			</div>
	
			<div class="flex flex-col">
				<h2>Outputs</h2>
				<ul>
					{#each outputs as output}
						<li>
							<button
								on:click={(_) => midi.selectOutput(output)}
								class={`hover:before:scale-x-100 hover:before:origin-left relative before:w-full before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-charcoal before:absolute before:left-0 before:bottom-0 ${
									selectedOutput?.id === output.id ? 'font-bold' : ''
								}`}
								>{output.manufacturer}: {output.name}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	
</section>
