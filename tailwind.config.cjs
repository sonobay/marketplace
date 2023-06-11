/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				link: 'rgb(34 211 238)', // text-cyan-400
				charcoal: '#414141',
				midiBlue: '#6EC6FF',
				midiBlueLight: '#B2D1EE',
				midiBlueLink: '#1A85C0',
				gold: '#FFCA09',
				midiYellow: '#FFDD57',
				midiYellowLight: '#FCE688',
				midiGray: 'rgb(0 0 0 / 0.3)',
				midiGrayLight: 'rgb(0 0 0 / 0.05)'
			}
		},
		container: {
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px'
				// xl: '768px'
			}
		}
	},
	plugins: []
};
