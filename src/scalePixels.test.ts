// oxlint-disable typescript/no-explicit-any
import IsomorphicImageData from '@canvas/image-data';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { getPixelTheCatScale1, getPixelTheCatScale10, getPixelTheCatScale5 } from '../test/testImageData.js';
import { getPixelScale } from './getPixelScale.js';
import { dividePixelScale, multiplyPixelScale, scalePixels } from './scalePixels.js';

vi.setConfig({ testTimeout: 5000 });

globalThis.ImageData = IsomorphicImageData as any;

const imageData = {
  scale1: [] as unknown as ImageData,
  scale5: [] as unknown as ImageData,
  scale10: [] as unknown as ImageData,
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
    getPixelTheCatScale10().then(p => {
      imageData.scale10 = p;
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

    // x1 to x10
    expected = imageData.scale10;
    result = scalePixels(imageData.scale1, 10, { from: 1 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x5 to x10
    expected = imageData.scale10;
    result = scalePixels(imageData.scale5, 10, { from: 5 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);
  });

  it('downscales pixels', () => {
    expect.hasAssertions();

    let expected: ImageData;
    let result: ImageData;

    // x10 to x5
    expected = imageData.scale5;
    result = scalePixels(imageData.scale10, 5, { from: 10 });
    expect(result.data).toHaveLength(expected.width * expected.height * 4);
    expect(result.data.join(',')).toStrictEqual(expected.data.join(','));
    expect(result.width).toBe(expected.width);
    expect(result.height).toBe(expected.height);

    // x10 to x1
    expected = imageData.scale1;
    result = scalePixels(imageData.scale10, 1, { from: 10 });
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

  it('returns a clone when `to` equals the current scale', () => {
    const result = scalePixels(imageData.scale5, 5, { from: 5 });

    expect(result).not.toBe(imageData.scale5);
    expect(result.data).not.toBe(imageData.scale5.data);
    expect(result.data.join(',')).toBe(imageData.scale5.data.join(','));
    expect(result.width).toBe(imageData.scale5.width);
    expect(result.height).toBe(imageData.scale5.height);
  });
});

describe(multiplyPixelScale, () => {
  it.each([
    { startScale: 'scale1', multiplier: 6 },
    { startScale: 'scale5', multiplier: 4 },
    { startScale: 'scale10', multiplier: 2 },
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
    { startScale: 'scale10', divider: 5 },
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
