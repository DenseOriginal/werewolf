import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	root: './',
	resolve: {
		alias: [
			{
				find: "@/stdlib",
				replacement: path.resolve(__dirname, "src/stdlib")
			},
			{
				find: "@/store",
				replacement: path.resolve(__dirname, "src/store")
			},
			{
				find: "@/services",
				replacement: path.resolve(__dirname, "src/services")
			},
			{
				find: "@/components",
				replacement: path.resolve(__dirname, "src/components")
			},
		]
	}
})
