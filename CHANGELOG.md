# Changelog

## 3.0.0

### Major Changes

- **BREAKING** Drop CommonJS build; ship ESM only. _[`586b392`](https://github.com/duniul/pixel-scale/commit/586b392548870fda7fee9b877630cfa16109a012) [@duniul](https://github.com/duniul)_
- **BREAKING** Validate all inputs and throw `TypeError`/`RangeError` early on invalid arguments. _[`dcfae6a`](https://github.com/duniul/pixel-scale/commit/dcfae6a85e31beb39d726a2cb4e5b8695f2278d1) [@duniul](https://github.com/duniul)_

### Minor Changes

- Export `assertValidImageData` for validating `ImageDataLike` input at runtime. _[`dcfae6a`](https://github.com/duniul/pixel-scale/commit/dcfae6a85e31beb39d726a2cb4e5b8695f2278d1) [@duniul](https://github.com/duniul)_
- Add JSDoc/TSDoc comments to exported functions and types. _[`17e56c8`](https://github.com/duniul/pixel-scale/commit/17e56c87d9ce68afec1cba0a2cdb456223df3d02) [@duniul](https://github.com/duniul)_

### Patch Changes

- Speed up `scalePixels` by preallocating the output `Uint8ClampedArray` (up to 8x faster). _[`4ec81e7`](https://github.com/duniul/pixel-scale/commit/4ec81e72fafcd0042c4dc07d38630ad4aeb7a599) [@duniul](https://github.com/duniul)_
- Speed up `getPixelScale` by iterating data as a `Uint32Array` (up to 2x faster). _[`830df11`](https://github.com/duniul/pixel-scale/commit/830df11d088e771214b5c2cdb864c341bed98074) [@duniul](https://github.com/duniul)_
- Add early exit in `scalePixels` when `to` equals the current scale. _[`9ee2a9c`](https://github.com/duniul/pixel-scale/commit/9ee2a9c64bfadecd288722c1577c68a9b74ef4ac) [@duniul](https://github.com/duniul)_
- Fix early exit in `getPixelScale` when only one scale is possible. _[`7891ae2`](https://github.com/duniul/pixel-scale/commit/7891ae29e88cb7c3a4037323507e38e1572ce90a) [@duniul](https://github.com/duniul)_
- Fix `multiplyPixelScale` and `dividePixelScale` ignoring `options.from`. _[`f268072`](https://github.com/duniul/pixel-scale/commit/f2680725161f21d30764e87eac2d7e42ae9a7779) [@duniul](https://github.com/duniul)_
- Mark the package as side-effect free for better tree-shaking. _[`8e68eb6`](https://github.com/duniul/pixel-scale/commit/8e68eb6d390dedcccfeab2dc4f02fd5de0b0a0c2) [@duniul](https://github.com/duniul)_

## 2.0.1

### Patch Changes

- Code clean up and corrected readme. _[`17c47c2`](https://github.com/duniul/pixel-scale/commit/17c47c2e90cf8a7f4bc89dbe1446d13544c2e71d) [@duniul](https://github.com/duniul)_

## 2.0.0

### Major Changes

- Removed default export. Use the `scalePixels` named export instead. _[`1505f1c`](https://github.com/duniul/pixel-scale/commit/1505f1cb90f497eb450d543b496ea1d4d916aeac) [@duniul](https://github.com/duniul)_

### Minor Changes

- Add `multiplyPixelScale` and `dividePixelScale` functions to simplify up- and downscaling. _[`#3`](https://github.com/duniul/pixel-scale/pull/3) [`cf72c58`](https://github.com/duniul/pixel-scale/commit/cf72c581ed91cc419c3fc181b319c3afaec847ad) [@duniul](https://github.com/duniul)_
- Make `options` parameter optional. _[`#3`](https://github.com/duniul/pixel-scale/pull/3) [`af13373`](https://github.com/duniul/pixel-scale/commit/af133739744c1addb701bc4dc48a19037a15c8d8) [@duniul](https://github.com/duniul)_

### Patch Changes

- Fix exports to work with both ESM and CJS. _[`198f03e`](https://github.com/duniul/pixel-scale/commit/198f03e232ca73a808f6243e56c3fc51edcfc7dd) [@duniul](https://github.com/duniul)_

## 1.0.0

- Initial release
