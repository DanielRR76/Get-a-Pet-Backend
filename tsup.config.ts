import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/server.ts'],
    outDir: 'dist',
    format: ['esm'],
    target: 'es2023',
    sourcemap: true,
    clean: true,
    dts: false,
});
