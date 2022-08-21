import { writable, get } from 'svelte/store';

interface MidiStore {
	inputs: WebMidi.MIDIInputMap | undefined;
	selectedInput: WebMidi.MIDIInput | undefined;
}

const createMidi = () => {
	// const { subscribe, set, update } = writable(0);
	const { subscribe, set, update } = writable<MidiStore>({
		inputs: undefined,
		selectedInput: undefined
	});

	function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
		setInputs(midiAccess.inputs);

		midiAccess.onstatechange = (e) => {
			console.log('connection event!', e);
			if (!e.isTrusted) {
				return;
			}
			setInputs(midiAccess.inputs);
		};
	}

	const setInputs = (inputs: WebMidi.MIDIInputMap) => {
		console.log('inputs are: ', inputs);

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
		selectInput
	};
};

export const midi = createMidi();

midi.connect();
