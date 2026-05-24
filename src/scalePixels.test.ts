// oxlint-disable typescript/no-explicit-any
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { getPixelTheCatScale1, getPixelTheCatScale10, getPixelTheCatScale5 } from '../test/testImageData.js';
import { getPixelScale } from './getPixelScale.js';
import { dividePixelScale, multiplyPixelScale, scalePixels } from './scalePixels.js';

vi.setConfig({ testTimeout: 5000 });

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

function makeImageData(width: number, height: number): ImageData {
  return new ImageData(new Uint8ClampedArray(width * height * 4), width, height);
}

describe('input validation', () => {
  describe(scalePixels, () => {
    it('rejects an invalid imageData', () => {
      // oxlint-disable-next-line typescript/no-explicit-any
      expect(() => scalePixels(null as any, 2)).toThrow(TypeError);
      expect(() => scalePixels({ width: 2, height: 2, data: new Uint8ClampedArray(4) } as any, 2)).toThrow(
        RangeError
      );
    });

    it('rejects a non-positive-integer `to`', () => {
      const id = makeImageData(2, 2);
      expect(() => scalePixels(id, 0)).toThrow(RangeError);
      expect(() => scalePixels(id, -1)).toThrow(RangeError);
      expect(() => scalePixels(id, 1.5)).toThrow(RangeError);
      expect(() => scalePixels(id, '2' as any)).toThrow(TypeError);
    });

    it('rejects an invalid `options.from`', () => {
      const id = makeImageData(4, 4);
      expect(() => scalePixels(id, 2, { from: 0 })).toThrow(RangeError);
      expect(() => scalePixels(id, 2, { from: -2 })).toThrow(RangeError);
      expect(() => scalePixels(id, 2, { from: 1.5 })).toThrow(RangeError);
    });

    it('rejects an invalid `options.maxColorDiff`', () => {
      const id = makeImageData(4, 4);
      expect(() => scalePixels(id, 2, { from: 1, maxColorDiff: -1 })).toThrow(RangeError);
      expect(() => scalePixels(id, 2, { from: 1, maxColorDiff: 0.5 })).toThrow(RangeError);
      // 0 is allowed
      expect(() => scalePixels(id, 1, { from: 1, maxColorDiff: 0 })).not.toThrow();
    });

    it('rejects when `from` does not evenly divide the image dimensions', () => {
      const id = makeImageData(10, 10);
      expect(() => scalePixels(id, 2, { from: 3 })).toThrow(RangeError);
    });
  });

  describe(multiplyPixelScale, () => {
    it('rejects an invalid imageData', () => {
      expect(() => multiplyPixelScale(null as any, 2)).toThrow(TypeError);
    });

    it('rejects a non-positive-integer multiplier', () => {
      const id = makeImageData(2, 2);
      expect(() => multiplyPixelScale(id, 0, { from: 1 })).toThrow(RangeError);
      expect(() => multiplyPixelScale(id, -1, { from: 1 })).toThrow(RangeError);
      expect(() => multiplyPixelScale(id, 1.5, { from: 1 })).toThrow(RangeError);
      expect(() => multiplyPixelScale(id, '2' as any, { from: 1 })).toThrow(TypeError);
    });

    it('rejects invalid options', () => {
      const id = makeImageData(2, 2);
      expect(() => multiplyPixelScale(id, 2, { from: 0 })).toThrow(RangeError);
      expect(() => multiplyPixelScale(id, 2, { from: 1, maxColorDiff: -1 })).toThrow(RangeError);
    });
  });

  describe(dividePixelScale, () => {
    it('rejects an invalid imageData', () => {
      expect(() => dividePixelScale(null as any, 2)).toThrow(TypeError);
    });

    it('rejects a non-positive-integer divider', () => {
      const id = makeImageData(2, 2);
      expect(() => dividePixelScale(id, 0, { from: 2 })).toThrow(RangeError);
      expect(() => dividePixelScale(id, -1, { from: 2 })).toThrow(RangeError);
      expect(() => dividePixelScale(id, 1.5, { from: 2 })).toThrow(RangeError);
      expect(() => dividePixelScale(id, '2' as any, { from: 2 })).toThrow(TypeError);
    });

    it('rejects when divider does not evenly divide `from`', () => {
      const id = makeImageData(6, 6);
      expect(() => dividePixelScale(id, 4, { from: 6 })).toThrow(RangeError);
    });

    it('rejects invalid options', () => {
      const id = makeImageData(2, 2);
      expect(() => dividePixelScale(id, 1, { from: -2 })).toThrow(RangeError);
      expect(() => dividePixelScale(id, 1, { from: 2, maxColorDiff: -1 })).toThrow(RangeError);
    });
  });
});
