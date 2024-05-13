import { getPixelScale } from './getPixelScale.js';
import type { ScalePixelsOptions } from './types.js';

export function scalePixels(
  imageData: ImageData,
  to: number,
  options?: ScalePixelsOptions | undefined | null
): ImageData {
  const { from, maxColorDiff } = options || {};
  const { data, width, height } = imageData;
  const currentScale = from || getPixelScale(imageData, { maxColorDiff: maxColorDiff || 0 });
  const dataLength = data.length;
  const rowLength = width * 4;
  const scaledRowLength = currentScale * rowLength;
  const newScale = to;
  const newWidth = (width / currentScale) * newScale;
  const newHeight = (height / currentScale) * newScale;
  const newData: number[] = [];

  // loop through each row of the current scale
  for (let rowStart = 0; rowStart < dataLength; rowStart += scaledRowLength) {
    const rowEnd = rowStart + rowLength;
    // create one row per pixel scale
    for (let rowCount = 0; rowCount < newScale; rowCount++) {
      // loop through each scaled pixel on the row
      for (let pStart = rowStart; pStart < rowEnd; pStart += currentScale * 4) {
        // add the corresponding colors according to the new scale
        for (let colCount = 0; colCount < newScale; colCount++) {
          newData.push(data[pStart], data[pStart + 1], data[pStart + 2], data[pStart + 3]);
        }
      }
    }
  }

  return new ImageData(Uint8ClampedArray.from(newData), newWidth, newHeight);
}

export function multiplyPixelScale(
  imageData: ImageData,
  multiplier: number,
  options?: ScalePixelsOptions | undefined | null
) {
  const scale = getPixelScale(imageData, options);
  return scalePixels(imageData, scale * multiplier, options);
}

export function dividePixelScale(
  imageData: ImageData,
  divider: number,
  options?: ScalePixelsOptions | undefined | null
) {
  const scale = getPixelScale(imageData, options);
  return scalePixels(imageData, scale / divider, options);
}
