import { defineConfig } from 'tsdown';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  outDir: 'dist',
  target: 'es2020',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  sourcemap: false,
  clean: true,
  dts: true,
});
