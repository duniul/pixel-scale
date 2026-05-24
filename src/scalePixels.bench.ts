import { bench, describe } from 'vitest';
import { getPixelTheCatScale1 } from '../test/testImageData.js';
import { scalePixels } from './scalePixels.js';

const scale1 = await getPixelTheCatScale1();

describe(scalePixels, () => {
  for (const to of [10, 20, 50, 100] as const) {
    bench(`x1 -> x${to} (with from)`, () => {
      const scaled = scalePixels(scale1, to, { from: 1 });
      scalePixels(scaled, 1, { from: to });
    });
  }

  for (const to of [10, 20, 50, 100] as const) {
    bench(`x1 -> x${to} (auto-detect scale)`, () => {
      const scaled = scalePixels(scale1, to);
      scalePixels(scaled, 1);
    });
  }
});
