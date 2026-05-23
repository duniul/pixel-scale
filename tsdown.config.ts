import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['esm'],
  entry: ['src/index.ts'],
  outDir: 'dist',
  target: 'es2022',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  sourcemap: false,
  clean: true,
  dts: true,
});
