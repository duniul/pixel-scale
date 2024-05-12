import IsomorphicImageData from '@canvas/image-data';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  getPixelTheCatScale1,
  getPixelTheCatScale5,
  getPixelTheCatScale32,
} from '../test/testImageData.js';
import { getPixelScale } from './getPixelScale.js';
import { scalePixels, dividePixelScale, multiplyPixelScale } from './scalePixels.js';

global.ImageData = IsomorphicImageData as any;

const testImageData: Record<string | number, ImageData> = {};

beforeAll(async () => {
  const [p1, p5, p32] = await Promise.all([
    getPixelTheCatScale1(),
    getPixelTheCatScale5(),
    getPixelTheCatScale32(),
  ]);
  testImageData[1] = p1;
  testImageData[5] = p5;
  testImageData[32] = p32;
});

describe(scalePixels.name, () => {
  it('upscales pixels', async () => {
    let expected: ImageData;
    let result: ImageData;

    // x1 to x5
    expected = testImageData[5];
    result = scalePixels(testImageData[1], 5, { from: 1 });
    expect(result.data.length).toEqual(expected.width * expected.height * 4);
    expect(result.data.join()).toEqual(expected.data.join());
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x1 to x32
    expected = testImageData[32];
    result = scalePixels(testImageData[1], 32, { from: 1 });
    expect(result.data.length).toEqual(expected.width * expected.height * 4);
    expect(result.data.join()).toEqual(expected.data.join());
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x5 to x32
    expected = testImageData[32];
    result = scalePixels(testImageData[5], 32, { from: 5 });
    expect(result.data.length).toEqual(expected.width * expected.height * 4);
    expect(result.data.join()).toEqual(expected.data.join());
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);
  });

  it('downscales pixels', async () => {
    let expected: ImageData;
    let result: ImageData;

    // x32 to x5
    expected = testImageData[5];
    result = scalePixels(testImageData[32], 5, { from: 32 });
    expect(result.data.length).toEqual(expected.width * expected.height * 4);
    expect(result.data.join()).toEqual(expected.data.join());
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x32 to x1
    expected = testImageData[1];
    result = scalePixels(testImageData[32], 1, { from: 32 });
    expect(result.data.length).toEqual(expected.width * expected.height * 4);
    expect(result.data.join()).toEqual(expected.data.join());
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x5 to x1
    expected = testImageData[1];
    result = scalePixels(testImageData[5], 1, { from: 5 });
    expect(result.data.length).toEqual(expected.width * expected.height * 4);
    expect(result.data.join()).toEqual(expected.data.join());
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);
  });
});

describe(multiplyPixelScale.name, () => {
  it.each([
    { startScale: 1, times: 8 },
    { startScale: 5, times: 6 },
    { startScale: 32, times: 3 },
  ])('multiplies pixel scale (from: $startScale, times: $times)', async ({ startScale, times }) => {
    const imageData = await testImageData[startScale];
    const imageScale = getPixelScale(imageData);
    const expectedScale = times * imageScale;
    const expectedHeight = imageData.height * times;
    const expectedWidth = imageData.width * times;

    const result = multiplyPixelScale(imageData, times);

    expect(getPixelScale(result)).toBe(expectedScale);
    expect(result.height).toBe(expectedHeight);
    expect(result.width).toBe(expectedWidth);
  });
});

describe(dividePixelScale.name, () => {
  it.each([
    { startScale: 1, times: 8 },
    { startScale: 5, times: 6 },
    { startScale: 32, times: 3 },
  ])('divides pixel scale (from: $startScale, times: $times)', async ({ startScale, times }) => {
    const imageData = await testImageData[startScale];
    const imageScale = getPixelScale(imageData);
    const expectedScale = times * imageScale;
    const expectedHeight = imageData.height * times;
    const expectedWidth = imageData.width * times;

    const result = multiplyPixelScale(imageData, times);

    expect(getPixelScale(result)).toBe(expectedScale);
    expect(result.height).toBe(expectedHeight);
    expect(result.width).toBe(expectedWidth);
  });
});
