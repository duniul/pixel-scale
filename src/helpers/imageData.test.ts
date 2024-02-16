import ImageData from '@canvas/image-data';
import { describe, expect, it } from 'vitest';
import { isValidImageData } from './imageData.js';

describe('isValidImageData', () => {
  it('returns true if input has valid ImageData shape', () => {
    const dataArr = [0, 0, 0, 0];
    const imageDataLikeUint8 = { data: new Uint8ClampedArray(dataArr), width: 1, height: 1 };
    const imageDataLikeRegular = { data: dataArr, width: 1, height: 1 };
    const trueImageData = new ImageData(5, 5);

    expect(isValidImageData(imageDataLikeUint8)).toEqual(true);
    expect(isValidImageData(imageDataLikeRegular)).toEqual(true);
    expect(isValidImageData(trueImageData)).toEqual(true);
  });

  it('returns false if width is invalid', () => {
    const input = { data: [0, 0, 0, 0], width: 1, height: 1 };
    const missing = { ...input, width: undefined };
    const notANumber = { ...input, width: 'foo' };

    expect(isValidImageData(missing as any)).toEqual(false);
    expect(isValidImageData(notANumber as any)).toEqual(false);
  });

  it('returns false if height is invalid', () => {
    const input = { data: [0, 0, 0, 0], width: 1, height: 1 };
    const missing = { ...input, height: undefined };
    const notANumber = { ...input, height: 'foo' };

    expect(isValidImageData(missing as any)).toEqual(false);
    expect(isValidImageData(notANumber as any)).toEqual(false);
  });

  it('returns false if data is not correct length', () => {
    // length should be height * width * 4 (one index per color channel)

    const missing = { width: 1, height: 1, data: undefined };
    const tooShort = { width: 1, height: 1, data: [0, 0] };
    const tooLong = { width: 1, height: 1, data: [0, 0, 0, 0, 0, 0] };

    expect(isValidImageData(missing as any)).toEqual(false);
    expect(isValidImageData(tooShort as any)).toEqual(false);
    expect(isValidImageData(tooLong as any)).toEqual(false);
  });
});
