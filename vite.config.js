"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_swc_1 = __importDefault(require("@vitejs/plugin-react-swc"));
const path_1 = __importDefault(require("path"));
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_swc_1.default)()],
    root: './',
    resolve: {
        alias: [
            {
                find: "@/stdlib",
                replacement: path_1.default.resolve(__dirname, "src/stdlib")
            },
            {
                find: "@/store",
                replacement: path_1.default.resolve(__dirname, "src/store")
            },
            {
                find: "@/services",
                replacement: path_1.default.resolve(__dirname, "src/services")
            },
            {
                find: "@/components",
                replacement: path_1.default.resolve(__dirname, "src/components")
            },
        ]
    }
});
