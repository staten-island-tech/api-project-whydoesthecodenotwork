// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                passport: resolve(__dirname, "passport.html"),
                citation: resolve(__dirname, "citation.html"),
            },
        },
    },
});
