// oxlint-disable typescript/no-explicit-any
import IsomorphicImageData from '@canvas/image-data';
import { bench, describe } from 'vitest';
import { getPixelTheCatScale1 } from '../test/testImageData.js';
import { scalePixels } from './scalePixels.js';

globalThis.ImageData = IsomorphicImageData as any;

const scale1 = await getPixelTheCatScale1();

describe(scalePixels, () => {
  for (const to of [5, 10, 20, 50] as const) {
    bench(`x1 -> x${to}`, () => {
      const scaled = scalePixels(scale1, to, { from: 1 });
      scalePixels(scaled, 1, { from: to });
    });
  }
});
