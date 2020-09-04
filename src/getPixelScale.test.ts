import { getPixelScale } from '.';
import {
  getPixelTheCatScale1,
  getPixelTheCatScale32,
  getPixelTheCatScale5,
  getVectorAvatar,
  getWhiteSquareScale100,
} from '../test/testImageData';

const imageData: Record<string, ImageData> = {};

beforeAll(async () => {
  imageData.scale1ImageData = await getPixelTheCatScale1();
  imageData.scale5ImageData = await getPixelTheCatScale5();
  imageData.scale32ImageData = await getPixelTheCatScale32();
  imageData.vectorAvatar = await getVectorAvatar();
  imageData.whiteSquare = await getWhiteSquareScale100();
});

it('returns the correct pixel scale', async () => {
  expect(getPixelScale(imageData.scale1ImageData)).toBe(1);
  expect(getPixelScale(imageData.scale5ImageData)).toBe(5);
  expect(getPixelScale(imageData.scale32ImageData)).toBe(32);
  expect(getPixelScale(imageData.vectorAvatar)).toBe(1);
});

it('returns full width of square, single color images', async () => {
  expect(getPixelScale(imageData.whiteSquare)).toBe(100);
});
