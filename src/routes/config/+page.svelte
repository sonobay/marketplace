<script lang="ts">
	import { midi } from '$lib/stores/midi';
	import { onDestroy } from 'svelte';

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

<div>
	<h1 class="text-xl mb-4">MIDI Settings</h1>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<span>Inputs: </span>

			<ul>
				{#each inputs as input}
					<li class="flex items-center">
						<span
							on:click={(_) => midi.selectInput(input)}
							class={`cursor-pointer px-2 ${
								selectedInput?.id === input.id ? 'bg-emerald-500 text-white' : 'text-gray-400'
							}`}>- {input.manufacturer}: {input.name}</span
						>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<span>Outputs: </span>

			<ul>
				{#each outputs as output}
					<li class="flex items-center">
						<span
							on:click={(_) => midi.selectOutput(output)}
							class={`cursor-pointer px-2 ${
								selectedOutput?.id === output.id ? 'bg-emerald-500 text-white' : 'text-gray-400'
							}`}>- {output.manufacturer}: {output.name}</span
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
