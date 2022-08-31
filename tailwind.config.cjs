/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['VT323', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};
