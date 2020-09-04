import ImageData from '@canvas/image-data';
import {
  getPixelTheCatScale1,
  getPixelTheCatScale32,
  getPixelTheCatScale5,
} from '../test/testImageData';
import { scalePixels } from './scalePixels';

global.ImageData = ImageData;

let pixelScale1: ImageData;
let pixelScale5: ImageData;
let pixelScale32: ImageData;

beforeAll(async () => {
  pixelScale1 = await getPixelTheCatScale1();
  pixelScale5 = await getPixelTheCatScale5();
  pixelScale32 = await getPixelTheCatScale32();
});

it('upscales pixels', async () => {
  let expected;
  let result;

  // x1 to x5
  expected = pixelScale5;
  result = scalePixels(pixelScale1, 5, { from: 1 });
  expect(result.data.length).toEqual(expected.width * expected.height * 4);
  expect(result.data.join()).toEqual(expected.data.join());
  expect(result.width).toBe(expected.width);
  expect(result.height).toBe(expected.height);

  // x1 to x32
  expected = pixelScale32;
  result = scalePixels(pixelScale1, 32, { from: 1 });
  expect(result.data.length).toEqual(expected.width * expected.height * 4);
  expect(result.data.join()).toEqual(expected.data.join());
  expect(result.width).toBe(expected.width);
  expect(result.height).toBe(expected.height);

  // x5 to x32
  expected = pixelScale32;
  result = scalePixels(pixelScale5, 32, { from: 5 });
  expect(result.data.length).toEqual(expected.width * expected.height * 4);
  expect(result.data.join()).toEqual(expected.data.join());
  expect(result.width).toBe(expected.width);
  expect(result.height).toBe(expected.height);
});

it('downscales pixels', async () => {
  let expected;
  let result;

  // x32 to x5
  expected = pixelScale5;
  result = scalePixels(pixelScale32, 5, { from: 32 });
  expect(result.data.length).toEqual(expected.width * expected.height * 4);
  expect(result.data.join()).toEqual(expected.data.join());
  expect(result.width).toBe(expected.width);
  expect(result.height).toBe(expected.height);

  // x32 to x1
  expected = pixelScale1;
  result = scalePixels(pixelScale32, 1, { from: 32 });
  expect(result.data.length).toEqual(expected.width * expected.height * 4);
  expect(result.data.join()).toEqual(expected.data.join());
  expect(result.width).toBe(expected.width);
  expect(result.height).toBe(expected.height);

  // x5 to x1
  expected = pixelScale1;
  result = scalePixels(pixelScale5, 1, { from: 5 });
  expect(result.data.length).toEqual(expected.width * expected.height * 4);
  expect(result.data.join()).toEqual(expected.data.join());
  expect(result.width).toBe(expected.width);
  expect(result.height).toBe(expected.height);
});
