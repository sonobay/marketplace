import { writable, get } from 'svelte/store';

interface MidiStore {
	inputs: WebMidi.MIDIInputMap | undefined;
	selectedInput: WebMidi.MIDIInput | undefined;
	outputs: WebMidi.MIDIOutputMap | undefined;
	selectedOutput: WebMidi.MIDIOutput | undefined;
}

const createMidi = () => {
	// const { subscribe, set, update } = writable(0);
	const { subscribe, set, update } = writable<MidiStore>({
		inputs: undefined,
		selectedInput: undefined,
		outputs: undefined,
		selectedOutput: undefined
	});

	function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
		setInputs(midiAccess.inputs);
		setOutputs(midiAccess.outputs);

		midiAccess.onstatechange = (e) => {
			if (!e.isTrusted) {
				return;
			}

			setInputs(midiAccess.inputs);
			setOutputs(midiAccess.outputs);
		};
	}

	const setInputs = (inputs: WebMidi.MIDIInputMap) => {
		/**
		 * Update Inputs
		 */
		update((state) => {
			state.inputs = inputs;

			/**
			 * Clear out selected input if no longer exists
			 */
			if (state.selectedInput && !inputs.has(state.selectedInput.id)) {
				state.selectedInput.close();
				state.selectedInput = undefined;
			}

			return state;
		});
	};

	const setOutputs = (outputs: WebMidi.MIDIOutputMap) => {
		/**
		 * Update Inputs
		 */
		update((state) => {
			state.outputs = outputs;

			/**
			 * Clear out selected input if no longer exists
			 */
			if (state.selectedOutput && !outputs.has(state.selectedOutput.id)) {
				state.selectedOutput.close();
				state.selectedOutput = undefined;
			}

			return state;
		});
	};

	const selectInput = (input: WebMidi.MIDIInput) => {
		update((state) => {
			if (state.selectedInput) {
				const oldInput = state.selectedInput;
				oldInput.close();
			}

			state.selectedInput = input;
			return state;
		});
	};

	const selectOutput = (output: WebMidi.MIDIOutput) => {
		update((state) => {
			if (state.selectedOutput) {
				const oldOutput = state.selectedOutput;
				oldOutput.close();
			}

			state.selectedOutput = output;
			return state;
		});
	};

	function onMIDIFailure(msg: Error) {
		console.error(`Failed to get MIDI access - ${msg}`);
	}

	const connect = () => {
		/** to avoid SSR errors */
		if (typeof window == 'undefined') {
			return;
		}
		navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
	};

	return {
		subscribe,
		connect,
		selectInput,
		selectOutput
	};
};

export const midi = createMidi();

export const sendMidiToOutput = async (msg: Uint8Array) => {
	if (!msg) {
		return;
	}
	const $midi = get(midi);

	if (!$midi.selectedOutput) {
		return;
	}

	if ($midi.selectedOutput.connection === 'closed') {
		await $midi.selectedOutput.open();
	}

	$midi.selectedOutput.send(msg);
	return;
};

midi.connect();
