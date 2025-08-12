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
				find: "@/views",
				replacement: path.resolve(__dirname, "src/views")
			},
			{
				find: "@/stdlib",
				replacement: path.resolve(__dirname, "src/stdlib")
			},
			{
				find: "@/store",
				replacement: path.resolve(__dirname, "src/store")
			},
			{
				find: "@/firebase",
				replacement: path.resolve(__dirname, "src/firebase")
			},
			{
				find: "@/services",
				replacement: path.resolve(__dirname, "src/services")
			},
			{
				find: "@/components",
				replacement: path.resolve(__dirname, "src/components")
			},
			{
				find: "@/assets",
				replacement: path.resolve(__dirname, "src/assets")
			},
		]
	}
})
