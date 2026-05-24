// oxlint-disable typescript/no-explicit-any
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  getPixelTheCatScale1,
  getPixelTheCatScale5,
  getPixelTheCatScale10,
  getWhiteSquareScale100,
} from '../test/testImageData.js';
import { getPixelScale } from './getPixelScale.js';

vi.setConfig({ testTimeout: 5000 });

const imageData = {
  scale1ImageData: [] as unknown as ImageData,
  scale5ImageData: [] as unknown as ImageData,
  scale10ImageData: [] as unknown as ImageData,
  whiteSquare: [] as unknown as ImageData,
};

beforeAll(async () => {
  await Promise.all([
    getPixelTheCatScale1().then(p => {
      imageData.scale1ImageData = p;
      return p;
    }),
    getPixelTheCatScale5().then(p => {
      imageData.scale5ImageData = p;
      return p;
    }),
    getPixelTheCatScale10().then(p => {
      imageData.scale10ImageData = p;
      return p;
    }),
    getWhiteSquareScale100().then(p => {
      imageData.whiteSquare = p;
      return p;
    }),
  ]);
});

// oxlint-disable-next-line vitest/consistent-test-it
it('returns the correct pixel scale', () => {
  expect.hasAssertions();

  expect(getPixelScale(imageData.scale1ImageData)).toBe(1);
  expect(getPixelScale(imageData.scale5ImageData)).toBe(5);
  expect(getPixelScale(imageData.scale10ImageData)).toBe(10);
});

it('returns full width of square, single color images', () => {
  expect.hasAssertions();

  expect(getPixelScale(imageData.whiteSquare)).toBe(100);
});

describe('input validation', () => {
  it('rejects an invalid imageData', () => {
    expect(() => getPixelScale(null as any)).toThrow(TypeError);
    expect(() => getPixelScale({ width: 2, height: 2, data: new Uint8ClampedArray(4) } as any)).toThrow(
      RangeError
    );
  });

  it('rejects an invalid maxColorDiff', () => {
    expect(() => getPixelScale(imageData.scale1ImageData, { maxColorDiff: -1 })).toThrow(RangeError);
    expect(() => getPixelScale(imageData.scale1ImageData, { maxColorDiff: 0.5 })).toThrow(RangeError);
    expect(() => getPixelScale(imageData.scale1ImageData, { maxColorDiff: '0' as any })).toThrow(TypeError);
    // 0 is allowed
    expect(() => getPixelScale(imageData.scale1ImageData, { maxColorDiff: 0 })).not.toThrow();
  });
});
