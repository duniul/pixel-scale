import { findCommonDivisors } from './helpers/commonDivisors.js';
import { ImageDataLike, ImageDataLikeData, GetPixelScaleOptions } from './types.js';

function isMatchingColor(rgbaA: number[], rgbaB: number[], maxColorDiff: number) {
  return rgbaA.every((rgba, i) => {
    const colorDiff = Math.abs(rgba - rgbaB[i]);
    return colorDiff <= maxColorDiff;
  });
}

function isMatchingRange(
  data: ImageDataLikeData,
  length: number,
  indexA: number,
  indexB: number,
  maxColorDiff: number
) {
  for (let i = 0; i < length; i++) {
    const colorDiff = Math.abs(data[indexA + i] - data[indexB + i]);
    if (colorDiff > maxColorDiff) {
      return false;
    }
  }

  return true;
}

function getRGBATuple(data: ImageDataLikeData, index: number): number[] {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const alpha = data[index + 3];
  return [red, green, blue, alpha];
}

function isValidRow(
  data: ImageDataLikeData,
  scale: number,
  rowStart: number,
  rowEnd: number,
  maxColorDiff: number
) {
  const scaledPixel = scale * 4;

  // loop through each scaled pixel
  for (let scaledStart = rowStart; scaledStart < rowEnd; scaledStart += scaledPixel) {
    const scaledEnd = scaledStart + scaledPixel;
    const expectedRGBA = getRGBATuple(data, scaledStart);

    // loop through each actual pixel (except the first one), comparing them with the first one
    for (let pixelStart = scaledStart + 4; pixelStart < scaledEnd; pixelStart += 4) {
      const rgba = getRGBATuple(data, pixelStart);
      if (!isMatchingColor(expectedRGBA, rgba, maxColorDiff)) {
        return false;
      }
    }
  }

  return true;
}

function isValidScale(imageData: ImageDataLike, scale: number, maxColorDiff: number) {
  const { data, width } = imageData;
  const dataLength = data.length;
  const rowLength = width * 4;
  const scaledRowLength = rowLength * scale;

  // loop through each scaled up row
  for (let scaledRowStart = 0; scaledRowStart < dataLength; scaledRowStart += scaledRowLength) {
    const firstRowStart = scaledRowStart;
    const firstRowEnd = firstRowStart + rowLength;

    // verify that the first row is scaled correctly
    const validRow = isValidRow(data, scale, firstRowStart, firstRowEnd, maxColorDiff);
    if (!validRow) {
      return false;
    }

    // ensure all remaining rows in the scaled row are identical to the top row
    for (let rowCount = 1; rowCount < scale; rowCount++) {
      const rowStart = firstRowStart + rowCount * rowLength;
      const matchinRow = isMatchingRange(data, rowLength, firstRowStart, rowStart, maxColorDiff);
      if (!matchinRow) {
        return false;
      }
    }
  }

  return true;
}

export function getPixelScale(
  imageData: ImageDataLike,
  { maxColorDiff = 0 }: GetPixelScaleOptions = {}
): number {
  const { width, height } = imageData;
  const possibleScales = findCommonDivisors(width, height);

  // if dimensions are only divisable by 1,
  // then we cannot correctly determine the pixel scale
  if (findCommonDivisors.length === 1) {
    return 1;
  } else {
    possibleScales.shift();
  }

  // start from largest divisor, since it's more efficient
  // and we want to find the highest possible pixel scale
  for (let scaleIndex = possibleScales.length - 1; scaleIndex >= 0; scaleIndex--) {
    const scale = possibleScales[scaleIndex];
    const validScale = isValidScale(imageData, scale, maxColorDiff);
    if (validScale) {
      return scale;
    }
  }

  // failed to find correct scale, default to 1
  return 1;
}
