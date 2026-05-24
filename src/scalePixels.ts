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

export function multiplyPixelScale(
  imageData: ImageData,
  multiplier: number,
  options?: ScalePixelsOptions | undefined | null
): ImageData {
  assertMinInteger(multiplier, 1, 'multiplier');
  const from = options?.from ?? getPixelScale(imageData, options);
  return scalePixels(imageData, from * multiplier, { ...options, from });
}

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
