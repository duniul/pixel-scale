import { findCommonDivisors } from './helpers/commonDivisors.js';
import { assertMinInteger, assertValidImageData } from './helpers/validation.js';
import type { GetPixelScaleOptions, ImageDataLike } from './types.js';

/**
 * Compare two packed RGBA pixels per-channel by unpacking each byte from the u32,
 * and compare the difference between each channel against the maxColorDiff.
 */
function channelsWithinTolerance(pixelA: number, pixelB: number, maxColorDiff: number): boolean {
  return (
    /* oxlint-disable no-bitwise */
    Math.abs((pixelA & 0xff) - (pixelB & 0xff)) <= maxColorDiff &&
    Math.abs(((pixelA >>> 8) & 0xff) - ((pixelB >>> 8) & 0xff)) <= maxColorDiff &&
    Math.abs(((pixelA >>> 16) & 0xff) - ((pixelB >>> 16) & 0xff)) <= maxColorDiff &&
    Math.abs(((pixelA >>> 24) & 0xff) - ((pixelB >>> 24) & 0xff)) <= maxColorDiff
    /* oxlint-enable no-bitwise */
  );
}

/**
 * Compare two pixels by their Uint32 indices, and in comparison to the maxColorDiff.
 */
function pixelsMatch(data32: Uint32Array, aIdx: number, bIdx: number, maxColorDiff: number): boolean {
  const a = data32[aIdx]!; // oxlint-disable-line typescript/no-non-null-assertion
  const b = data32[bIdx]!; // oxlint-disable-line typescript/no-non-null-assertion

  if (a === b) return true;
  if (maxColorDiff === 0) return false;

  return channelsWithinTolerance(a, b, maxColorDiff);
}

function isValidScaledRow(
  data32: Uint32Array,
  rowStart: number,
  rowEnd: number,
  scale: number,
  maxColorDiff: number
): boolean {
  for (let scaledStart = rowStart; scaledStart < rowEnd; scaledStart += scale) {
    const scaledEnd = scaledStart + scale;

    for (let i = scaledStart + 1; i < scaledEnd; i++) {
      if (!pixelsMatch(data32, scaledStart, i, maxColorDiff)) {
        return false;
      }
    }
  }

  return true;
}

function areRowsMatching(
  data32: Uint32Array,
  rowStartA: number,
  rowStartB: number,
  width: number,
  maxColorDiff: number
): boolean {
  for (let i = 0; i < width; i++) {
    if (!pixelsMatch(data32, rowStartA + i, rowStartB + i, maxColorDiff)) {
      return false;
    }
  }

  return true;
}

function isValidScale(data32: Uint32Array, width: number, scale: number, maxColorDiff: number): boolean {
  const dataLength = data32.length;
  const scaledRowLength = width * scale;

  // loop through each scaled up row
  for (let scaledRowStart = 0; scaledRowStart < dataLength; scaledRowStart += scaledRowLength) {
    const firstRowEnd = scaledRowStart + width;

    // verify that the first row is scaled correctly
    if (!isValidScaledRow(data32, scaledRowStart, firstRowEnd, scale, maxColorDiff)) {
      return false;
    }

    // ensure all remaining rows in the scaled row are identical to the top row
    for (let rowCount = 1; rowCount < scale; rowCount++) {
      const rowStart = scaledRowStart + rowCount * width;
      if (!areRowsMatching(data32, scaledRowStart, rowStart, width, maxColorDiff)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Detects the pixel scale of an image. Selects the largest scale for which
 * every `scale × scale` block of pixels is a solid color.
 *
 * @param imageData - The image data to inspect.
 * @param options - Optional detection settings.
 * @returns The detected pixel scale (a positive integer, always ≥ 1).
 */
export function getPixelScale(
  imageData: ImageDataLike,
  options?: GetPixelScaleOptions | undefined | null
): number {
  assertValidImageData(imageData);
  const { maxColorDiff = 0 } = options || {};
  assertMinInteger(maxColorDiff, 0, 'options.maxColorDiff');
  const { data, width, height } = imageData;
  const possibleScales = findCommonDivisors(width, height);

  // if dimensions are only divisable by 1,
  // then we cannot correctly determine the pixel scale
  if (possibleScales.length === 1) {
    return 1;
  }

  // read 4 bytes at a time as a single Uint32, allowing for one compare per pixel instead of four
  const data32 = new Uint32Array(data.buffer, data.byteOffset, data.length / 4);

  // start from largest divisor, since it's more efficient
  // and we want to find the highest possible pixel scale
  for (let scaleIndex = possibleScales.length - 1; scaleIndex >= 1; scaleIndex--) {
    const scale = possibleScales[scaleIndex]!; // oxlint-disable-line typescript/no-non-null-assertion
    if (isValidScale(data32, width, scale, maxColorDiff)) {
      return scale;
    }
  }

  // failed to find correct scale, default to 1
  return 1;
}
