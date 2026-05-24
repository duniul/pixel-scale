import { getPixelScale } from './getPixelScale.js';
import {
  assertMinInteger,
  assertScaleDividesDimensions,
  assertValidImageData,
} from './helpers/validation.js';
import type { ScalePixelsOptions } from './types.js';

function validateOptions(options: ScalePixelsOptions | undefined | null): void {
  if (!options) return;
  if (options.from !== undefined) {
    assertMinInteger(options.from, 1, 'options.from');
  }
  if (options.maxColorDiff !== undefined) {
    assertMinInteger(options.maxColorDiff, 0, 'options.maxColorDiff');
  }
}

/**
 * Up- or downscales a pixel-art image to the given pixel scale without losing
 * quality or changing any colors.
 *
 * The current scale is auto-detected with {@link getPixelScale} unless
 * `options.from` is provided.
 *
 * @param imageData - The image data to scale.
 * @param to - The desired pixel scale of the output (must be a positive integer).
 * @param options - Optional settings controlling scale detection.
 * @returns A new {@link ImageData} at the requested scale.
 */
export function scalePixels(
  imageData: ImageData,
  to: number,
  options?: ScalePixelsOptions | undefined | null
): ImageData {
  assertValidImageData(imageData);
  assertMinInteger(to, 1, 'to');
  validateOptions(options);

  const { from, maxColorDiff } = options || {};
  const { data, width, height } = imageData;
  const currentScale = from ?? getPixelScale(imageData, { maxColorDiff: maxColorDiff ?? 0 });

  if (to === currentScale) {
    return new ImageData(new Uint8ClampedArray(data), width, height);
  }

  assertScaleDividesDimensions(
    width,
    height,
    currentScale,
    from === undefined ? 'detected scale' : 'options.from'
  );

  const dataLength = data.length;
  const rowLength = width * 4;
  const scaledRowLength = currentScale * rowLength;
  const newWidth = (width / currentScale) * to;
  const newHeight = (height / currentScale) * to;

  const newData = new Uint8ClampedArray(newWidth * newHeight * 4);
  let writeIndex = 0;

  // loop through each row of the current scale
  for (let rowStart = 0; rowStart < dataLength; rowStart += scaledRowLength) {
    const rowEnd = rowStart + rowLength;
    // create one row per pixel scale
    for (let rowCount = 0; rowCount < to; rowCount++) {
      // loop through each scaled pixel on the row
      for (let pStart = rowStart; pStart < rowEnd; pStart += currentScale * 4) {
        // add the corresponding colors according to the new scale
        for (let colCount = 0; colCount < to; colCount++) {
          newData[writeIndex++] = data[pStart]!; // oxlint-disable-line typescript/no-non-null-assertion
          newData[writeIndex++] = data[pStart + 1]!; // oxlint-disable-line typescript/no-non-null-assertion
          newData[writeIndex++] = data[pStart + 2]!; // oxlint-disable-line typescript/no-non-null-assertion
          newData[writeIndex++] = data[pStart + 3]!; // oxlint-disable-line typescript/no-non-null-assertion
        }
      }
    }
  }

  return new ImageData(newData, newWidth, newHeight);
}

/**
 * Upscales an image by multiplying its current pixel scale by the given
 * factor. For example, an image with a current scale of 5 multiplied by 2
 * becomes an image with a scale of 10.
 *
 * The current scale is auto-detected with {@link getPixelScale} unless
 * `options.from` is provided.
 *
 * @param imageData - The image to upscale.
 * @param multiplier - The factor to multiply the current scale by (must be a positive integer).
 * @param options - Optional settings controlling scale detection.
 * @returns A new, upscaled {@link ImageData}.
 */
export function multiplyPixelScale(
  imageData: ImageData,
  multiplier: number,
  options?: ScalePixelsOptions | undefined | null
): ImageData {
  assertMinInteger(multiplier, 1, 'multiplier');
  const from = options?.from ?? getPixelScale(imageData, options);

  return scalePixels(imageData, from * multiplier, { ...options, from });
}

/**
 * Downscales an image by dividing its current pixel scale by the given amount.
 * For example, an image with a current scale of 8 divided by 4 becomes an
 * image with a scale of 2.
 *
 * The current scale is auto-detected with {@link getPixelScale} unless
 * `options.from` is provided. Throws a {@link RangeError} if the current scale is
 * not evenly divisible by `divider`.
 *
 * @param imageData - The image to downscale.
 * @param divider - The amount to divide the current scale by (must be a positive integer and evenly divide the current scale).
 * @param options - Optional settings controlling scale detection.
 * @returns A new, downscaled {@link ImageData}.
 */
export function dividePixelScale(
  imageData: ImageData,
  divider: number,
  options?: ScalePixelsOptions | undefined | null
): ImageData {
  assertMinInteger(divider, 1, 'divider');
  const from = options?.from ?? getPixelScale(imageData, options);

  if (from % divider !== 0) {
    throw new RangeError(`divider (${divider}) must evenly divide from (${from})`);
  }

  return scalePixels(imageData, from / divider, { ...options, from });
}
