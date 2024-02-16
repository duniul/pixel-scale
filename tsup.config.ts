import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  outDir: 'dist',
  target: 'es2020',
  sourcemap: false,
  clean: true,
  shims: true,
  dts: true,
});
