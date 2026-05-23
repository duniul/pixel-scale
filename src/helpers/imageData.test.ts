// oxlint-disable typescript/no-explicit-any
import ImageData from '@canvas/image-data';
import { describe, expect, it, vi } from 'vitest';
import { isValidImageData } from './imageData.js';

vi.setConfig({ testTimeout: 5000 });

describe(isValidImageData, () => {
  it('returns true if input has valid ImageData shape', () => {
    expect.hasAssertions();

    const dataArr = [0, 0, 0, 0];
    const imageDataLikeUint8 = { data: new Uint8ClampedArray(dataArr), width: 1, height: 1 };
    const imageDataLikeRegular = { data: dataArr, width: 1, height: 1 };
    const trueImageData = new ImageData(5, 5);

    expect(isValidImageData(imageDataLikeUint8)).toBe(true);
    expect(isValidImageData(imageDataLikeRegular)).toBe(true);
    expect(isValidImageData(trueImageData)).toBe(true);
  });

  it('returns false if width is invalid', () => {
    expect.hasAssertions();

    const input = { data: [0, 0, 0, 0], width: 1, height: 1 };
    const missing = { ...input, width: undefined };
    const notANumber = { ...input, width: 'foo' };

    expect(isValidImageData(missing as any)).toBe(false);
    expect(isValidImageData(notANumber as any)).toBe(false);
  });

  it('returns false if height is invalid', () => {
    expect.hasAssertions();

    const input = { data: [0, 0, 0, 0], width: 1, height: 1 };
    const missing = { ...input, height: undefined };
    const notANumber = { ...input, height: 'foo' };

    expect(isValidImageData(missing as any)).toBe(false);
    expect(isValidImageData(notANumber as any)).toBe(false);
  });

  it('returns false if data is not correct length', () => {
    expect.hasAssertions();

    // length should be height * width * 4 (one index per color channel)

    const missing = { width: 1, height: 1, data: undefined };
    const tooShort = { width: 1, height: 1, data: [0, 0] };
    const tooLong = { width: 1, height: 1, data: [0, 0, 0, 0, 0, 0] };

    expect(isValidImageData(missing as any)).toBe(false);
    expect(isValidImageData(tooShort as any)).toBe(false);
    expect(isValidImageData(tooLong as any)).toBe(false);
  });
});
