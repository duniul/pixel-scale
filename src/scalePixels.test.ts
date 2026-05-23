// oxlint-disable typescript/no-explicit-any
import IsomorphicImageData from '@canvas/image-data';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { getPixelTheCatScale1, getPixelTheCatScale32, getPixelTheCatScale5 } from '../test/testImageData.js';
import { getPixelScale } from './getPixelScale.js';
import { dividePixelScale, multiplyPixelScale, scalePixels } from './scalePixels.js';

vi.setConfig({ testTimeout: 5000 });

globalThis.ImageData = IsomorphicImageData as any;

const imageData = {
  scale1: [] as unknown as ImageData,
  scale5: [] as unknown as ImageData,
  scale32: [] as unknown as ImageData,
};

beforeAll(async () => {
  await Promise.all([
    getPixelTheCatScale1().then(p => {
      imageData.scale1 = p;
      return p;
    }),
    getPixelTheCatScale5().then(p => {
      imageData.scale5 = p;
      return p;
    }),
    getPixelTheCatScale32().then(p => {
      imageData.scale32 = p;
      return p;
    }),
  ]);
});

describe(scalePixels, () => {
  it('upscales pixels', () => {
    expect.hasAssertions();

    let expected: ImageData;
    let result: ImageData;

    // x1 to x5
    expected = imageData.scale5;
    result = scalePixels(imageData.scale1, 5, { from: 1 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x1 to x32
    expected = imageData.scale32;
    result = scalePixels(imageData.scale1, 32, { from: 1 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x5 to x32
    expected = imageData.scale32;
    result = scalePixels(imageData.scale5, 32, { from: 5 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);
  });

  it('downscales pixels', () => {
    expect.hasAssertions();

    let expected: ImageData;
    let result: ImageData;

    // x32 to x5
    expected = imageData.scale5;
    result = scalePixels(imageData.scale32, 5, { from: 32 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x32 to x1
    expected = imageData.scale1;
    result = scalePixels(imageData.scale32, 1, { from: 32 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x5 to x1
    expected = imageData.scale1;
    result = scalePixels(imageData.scale5, 1, { from: 5 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);
  });
});

describe(multiplyPixelScale, () => {
  it.each([
    { startScale: 'scale1', multiplier: 6 },
    { startScale: 'scale5', multiplier: 4 },
    { startScale: 'scale32', multiplier: 2 },
  ] as const)(
    'multiplies pixel scale (from: $startScale, multiplier: $multiplier)',
    async ({ startScale, multiplier }) => {
      expect.hasAssertions();

      const newImageData = await imageData[startScale];
      const imageScale = getPixelScale(newImageData);
      const result = multiplyPixelScale(newImageData, multiplier);

      expect(getPixelScale(result)).toBe(imageScale * multiplier);
      expect(result.height).toBe(newImageData.height * multiplier);
      expect(result.width).toBe(newImageData.width * multiplier);
    }
  );
});

describe(dividePixelScale, () => {
  it.each([
    { startScale: 'scale5', divider: 5 },
    { startScale: 'scale32', divider: 8 },
  ] as const)(
    'divides pixel scale (from: $startScale, divider: $divider)',
    async ({ startScale, divider }) => {
      expect.hasAssertions();

      const newImageData = await imageData[startScale];
      const imageScale = getPixelScale(newImageData);
      const result = dividePixelScale(newImageData, divider);

      expect(getPixelScale(result)).toBe(imageScale / divider);
      expect(result.height).toBe(newImageData.height / divider);
      expect(result.width).toBe(newImageData.width / divider);
    }
  );
});
