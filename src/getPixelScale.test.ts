import { beforeAll, expect, it, vi } from 'vitest';
import {
  getPixelTheCatScale1,
  getPixelTheCatScale5,
  getPixelTheCatScale32,
  getVectorAvatar,
  getWhiteSquareScale100,
} from '../test/testImageData.js';
import { getPixelScale } from './getPixelScale.js';

vi.setConfig({ testTimeout: 5000 });

const imageData = {
  scale1ImageData: [] as unknown as ImageData,
  scale5ImageData: [] as unknown as ImageData,
  scale32ImageData: [] as unknown as ImageData,
  vectorAvatar: [] as unknown as ImageData,
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
    getPixelTheCatScale32().then(p => {
      imageData.scale32ImageData = p;
      return p;
    }),
    getVectorAvatar().then(p => {
      imageData.vectorAvatar = p;
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
  expect(getPixelScale(imageData.scale32ImageData)).toBe(32);
  expect(getPixelScale(imageData.vectorAvatar)).toBe(1);
});

it('returns full width of square, single color images', () => {
  expect.hasAssertions();

  expect(getPixelScale(imageData.whiteSquare)).toBe(100);
});
