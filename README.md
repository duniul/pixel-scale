<p align="center">
<img src="https://github.com/duniul/pixel-scale/blob/master/test/images/pixel-the-cat_x1.png" />
<img src="https://github.com/duniul/pixel-scale/blob/master/test/images/pixel-the-cat_x5.png" />
<img src="https://github.com/duniul/pixel-scale/blob/master/test/images/pixel-the-cat_x10.png" />
</p>

# pixel-scale

[![](https://img.shields.io/npm/v/pixel-scale?color=brightgreen)](https://www.npmjs.com/package/pixel-scale)
[![](https://img.shields.io/bundlephobia/minzip/pixel-scale)](https://bundlephobia.com/result?p=pixel-scale)

📐 Get the pixel scale of an image, or scale it up or down without quality loss. Useful for pixel
art!

All functions operate on [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData),
which can be retrieved from a
[canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) in the browser or e.g.
[node-canvas](https://github.com/Automattic/node-canvas) or [sharp](https://github.com/lovell/sharp)
on Node.

The pixel scale referred to in this readme is the amount of times a pixel of e.g. a pixel art image
has been multiplied to increase the image size. For example,
[this image](https://github.com/duniul/pixel-scale/blob/master/test/images/pixel-the-cat_x1.png) has
a pixel scale of 1, while
[this image](https://github.com/duniul/pixel-scale/blob/master/test/images/pixel-the-cat_x10.png)
has a pixel scale of 10.

## Demo

https://pixel-scale.netlify.app

## Installation

| npm                       | yarn                    |
| ------------------------- | ----------------------- |
| `npm install pixel-scale` | `yarn add pixel-scale`  |

## Usage

### `scalePixels(imageData, to, options)`

Up- or downscales an image to the specified scale, without losing quality or changing any colors.

**Parameters:**

- `imageData` (ImageData instance) - The ImageData instance to scale.

- `to` (number) - The desired scale of the new image.

- `options` (object, optional)
  - `from` (number) - The current scale of the image. If no `from` value is provided, the scale is
    calculated with `getPixelScale`. Only provide a `from` value if you are sure of the current
    pixel scale and want to save time.
  - `maxColorDiff` (number, default: 0) - Passed along to `getPixelScale` if no `from` value is set,
    otherwise does nothing.

**Return value:**

A new, scaled ImageData-instance.

**Examples:**

```js
import { scalePixels } from 'pixel-scale';

// detect an image's current scale, and rescale it to 1
const scale1ImageData = scalePixels(imageData, 1);

// increase an image's scale from 5 to 10
const scale10ImageData = scalePixels(imageData, 10, { from: 5 });

// detect an image's current scale, allowing a color diff of 10,
// and rescale it to 2
const scale2ImageData = scalePixels(imageData, 2, { maxColorDiff: 10 });
```

### `getPixelScale(imageData, options)`

Get the current pixel scale of an image.

**Parameters:**

- `imageData` (ImageData instance) - The ImageData instance to scale.

- `options` (object, optional)

  - `maxColorDiff` (number, default: 0) - A number setting the maximum difference allowed in an
    individual color channel (0-255) when comparing pixels. Useful when getting the pixel scale of
    an image that may contain e.g. JPEG-fragments or color distortions.

    As an example,
    [this Metal Slug image](https://github.com/duniul/pixel-scale/blob/master/test/images/metal-slug_x24.png)
    has a pixel scale of 24, but since it has been incorrectly resized and contains some
    miscolored lines between its scaled pixels it would be detected as having a scale of 1 unless
    the `maxColorDiff` is increased.

**Return value:**

A number indicating the image's pixel scale.

**Examples:**

```js
import { getPixelScale } from 'pixel-scale';

// get an image's pixel scale
const imageScale = getPixelScale(imageData);

// get an image's pixel scale, allowing a maximum difference of 10 when comparing
// color channels of individual pixels
const imageScale = getPixelScale(imageData, { maxColorDiff: 10 });
```

## How does it work?

To get the pixel scale of an image, `pixel-scale` first figures out the common divisors of the
image's height and width. This is done using Euclid's algorithm for finding the greatest common
divisor, and then counting down. A more performant method (e.g. prime factorization/Pollard rho) is
not deemed necessary here, as image dimensions never go up to those sizes that big.

It then tests each common divisor, starting with the largest one, by chunking up the image equally
sized pieces and verifying that they each chunk is in a solid color (scaled pixels). If a chunk
contains a different color outside of the max allowed span (`maxColorDiff`), then it will go to the
next divisor. If every chunk is a solid color, then the divisor is most likely the pixel scale of
the image.
