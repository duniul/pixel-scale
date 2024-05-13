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
    { startScale: 1, multiplier: 6 },
    { startScale: 5, multiplier: 4 },
    { startScale: 32, multiplier: 2 },
  ])(
    'multiplies pixel scale (from: $startScale, multiplier: $multiplier)',
    async ({ startScale, multiplier }) => {
      const imageData = await testImageData[startScale];
      const imageScale = getPixelScale(imageData);
      const result = multiplyPixelScale(imageData, multiplier);

      expect(getPixelScale(result)).toBe(imageScale * multiplier);
      expect(result.height).toBe(imageData.height * multiplier);
      expect(result.width).toBe(imageData.width * multiplier);
    }
  );
});

describe(dividePixelScale.name, () => {
  it.each([
    { startScale: 5, divider: 5 },
    { startScale: 32, divider: 8 },
  ])(
    'divides pixel scale (from: $startScale, divider: $divider)',
    async ({ startScale, divider }) => {
      const imageData = await testImageData[startScale];
      const imageScale = getPixelScale(imageData);
      const result = dividePixelScale(imageData, divider);

      expect(getPixelScale(result)).toBe(imageScale / divider);
      expect(result.height).toBe(imageData.height / divider);
      expect(result.width).toBe(imageData.width / divider);
    }
  );
});
