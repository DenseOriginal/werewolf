/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				"nova-cut": ['Nova Cut', 'system-ui']
			}
		},
		fontSize: {
			sm: '1rem',
			base: '1.3rem',
			lg: '1.55rem',
			xl: '1.863rem',
			'2xl': '2.153rem',
			'3xl': '2.741rem',
			'4xl': '3.352rem',
			'5xl': '3.849rem',
		}
	},
	plugins: [],
}

