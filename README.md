<p align="center">
<img src="https://github.com/duniul/pixel-scale/blob/main/test/images/pixel-the-cat_x1.png" alt="Cat at scale 1" />
<img src="https://github.com/duniul/pixel-scale/blob/main/test/images/pixel-the-cat_x5.png" alt="Cat at scale 5" />
<img src="https://github.com/duniul/pixel-scale/blob/main/test/images/pixel-the-cat_x10.png" alt="Cat at scale 10" />
</p>

# pixel-scale 📐

[![npm version](https://img.shields.io/npm/v/pixel-scale)](https://www.npmjs.com/package/pixel-scale)
[![npm downloads](https://img.shields.io/npm/dm/pixel-scale)](https://www.npmjs.com/package/pixel-scale)

Get the pixel scale of an image, or scale it up or down without quality loss. Useful for pixel
art!

- Zero loss of quality.
- Zero dependencies.
- Works directly on [ImageData](#imagedata).

## Table of contents

<details><summary>Click to open</summary>

- [Installation](#installation)
- [Usage](#usage)
  - [`scalePixels`](#scalepixels)
  - [`multiplyPixelScale`](#multiplypixelscale)
  - [`dividePixelScale`](#dividepixelscale)
  - [`getPixelScale`](#getpixelscale)
  - [Options](#options)
- [About](#about)
  - [ImageData](#imagedata)
  - [Pixel scale](#pixel-scale-1)
  - [How does it work?](#how-does-it-work)

</details>

## Installation

```bash
npm install pixel-scale
```

## Usage

All inputs are validated at runtime. Invalid arguments throw `TypeError` or `RangeError`.

### `scalePixels`

```ts
scalePixels(imageData, to, options?)
```

Scales an image up or down to a specific [pixel scale](#pixel-scale-1) without losing quality or
changing any colors. The current scale is detected with `getPixelScale` unless
[`options.from`](#options) is provided.

```js
// detect the current scale and rescale it to 1
scalePixels(imageData, 1);

// upscale from a known scale of 5 to 10
scalePixels(imageData, 10, { from: 5 });

// detect the current scale, allowing a per-channel diff of 10
scalePixels(imageData, 2, { maxColorDiff: 10 });
```

### `multiplyPixelScale`

```ts
multiplyPixelScale(imageData, multiplier, options?)
```

Upscales an image by multiplying its current pixel scale. For example, scale 5 multiplied by 2
becomes scale 10. The current scale is detected with `getPixelScale` unless
[`options.from`](#options) is provided.

```js
// detect the current scale and double it
multiplyPixelScale(imageData, 2);

// take an image of known scale 5 and multiply it by 10
multiplyPixelScale(imageData, 10, { from: 5 });
```

### `dividePixelScale`

```ts
dividePixelScale(imageData, divider, options?)
```

Downscales an image by dividing its current pixel scale. For example, scale 8 divided by 4 becomes
scale 2. The current scale is detected with `getPixelScale` unless [`options.from`](#options) is
provided. `divider` must evenly divide the current scale.

```js
// detect the current scale and halve it
dividePixelScale(imageData, 2);

// take an image of known scale 8 and divide it by 4
dividePixelScale(imageData, 4, { from: 8 });
```

### `getPixelScale`

```ts
getPixelScale(imageData, options?)
```

Detects the current [pixel scale](#pixel-scale-1) of an image. Returns the largest scale for which
every `scale × scale` block of pixels is a solid color, or `1` if no larger scale can be found.

Accepts the looser [`ImageDataLike`](#imagedata) shape, so it works on any `{ data, width, height }`
object.

```js
const scale = getPixelScale(imageData);

// allow a per-channel diff of 10 when comparing pixels
const scale = getPixelScale(imageData, { maxColorDiff: 10 });
```

### Options

`scalePixels`, `multiplyPixelScale`, and `dividePixelScale` accept the same options object.

`getPixelScale` only accepts `maxColorDiff`.

| Option         | Type     | Default         | Description                                                                                                                                                                |
| -------------- | -------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`         | `number` | _auto-detected_ | The current scale of the image. Only provide this if you already know the scale and want to skip detection.                                                                |
| `maxColorDiff` | `number` | `0`             | Maximum allowed per-channel difference (0-255) when comparing pixels during scale detection. Useful for images from lossy formats (e.g. JPEG). Ignored when `from` is set. |

## About

### ImageData

All functions operate on [`ImageData`](https://developer.mozilla.org/en-US/docs/Web/API/ImageData),
which you can get from a [canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
in the browser, or from libraries like [node-canvas](https://github.com/Automattic/node-canvas) or
[sharp](https://github.com/lovell/sharp) on Node.

`getPixelScale` is the most lenient and accepts any `{ data, width, height }` object (typed as
`ImageDataLike`). The other functions return a real `ImageData` instance, so they need the
`ImageData` constructor to be available globally.

### Pixel scale

The pixel scale referred to in this readme is the number of times a pixel of e.g. a pixel art image
has been multiplied to increase the image size. For example,
[this image](https://github.com/duniul/pixel-scale/blob/main/test/images/pixel-the-cat_x1.png) has
a pixel scale of 1, while
[this image](https://github.com/duniul/pixel-scale/blob/main/test/images/pixel-the-cat_x10.png) has
a pixel scale of 10.

### How does it work?

To detect an image's pixel scale, `pixel-scale` first finds the common divisors of its width and
height. This is done using Euclid's algorithm for the greatest common divisor, and then counting
down. A more performant method (like prime factorization) isn't needed here, since image dimensions
stay relatively small.

It then tests each common divisor, starting from the largest, by splitting the image into
`divisor * divisor` blocks and checking that every block is a solid color (within `maxColorDiff`).
The first divisor where every block passes is the pixel scale.
