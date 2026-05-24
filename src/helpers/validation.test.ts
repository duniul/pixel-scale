// oxlint-disable typescript/no-explicit-any
import { describe, expect, it, vi } from 'vitest';
import { assertMinInteger, assertScaleDividesDimensions, assertValidImageData } from './validation.js';

vi.setConfig({ testTimeout: 5000 });

describe(assertMinInteger, () => {
  it('accepts integers at or above the minimum', () => {
    expect(() => assertMinInteger(1, 1, 'x')).not.toThrow();
    expect(() => assertMinInteger(42, 1, 'x')).not.toThrow();
    expect(() => assertMinInteger(0, 0, 'x')).not.toThrow();
  });

  it('throws TypeError on non-numbers', () => {
    expect(() => assertMinInteger('1' as any, 1, 'x')).toThrow(TypeError);
    expect(() => assertMinInteger(undefined as any, 1, 'x')).toThrow(TypeError);
    expect(() => assertMinInteger(null as any, 1, 'x')).toThrow(TypeError);
  });

  it('throws RangeError when value is below the minimum', () => {
    expect(() => assertMinInteger(0, 1, 'x')).toThrow(RangeError);
    expect(() => assertMinInteger(-1, 0, 'x')).toThrow(RangeError);
  });

  it('throws RangeError on non-integers and non-finite values', () => {
    expect(() => assertMinInteger(1.5, 1, 'x')).toThrow(RangeError);
    expect(() => assertMinInteger(Number.NaN, 1, 'x')).toThrow(RangeError);
    expect(() => assertMinInteger(Number.POSITIVE_INFINITY, 1, 'x')).toThrow(RangeError);
  });

  it('includes the name and value in the error message', () => {
    expect(() => assertMinInteger(-3, 1, 'multiplier')).toThrow(/multiplier.*-3/);
  });

  it('includes the typeof in the error message when value is not a number', () => {
    expect(() => assertMinInteger('5' as any, 1, 'x')).toThrow(/string/);
  });
});

describe(assertValidImageData, () => {
  it('accepts a well-formed ImageDataLike', () => {
    const valid = { width: 2, height: 2, data: new Uint8ClampedArray(2 * 2 * 4) };
    expect(() => assertValidImageData(valid)).not.toThrow();
  });

  it('throws TypeError when the input is not an object', () => {
    expect(() => assertValidImageData(null)).toThrow(TypeError);
    expect(() => assertValidImageData('image' as any)).toThrow(TypeError);
    expect(() => assertValidImageData(42 as any)).toThrow(TypeError);
  });

  it('throws when width or height is missing or invalid', () => {
    const data = new Uint8ClampedArray(4);
    expect(() => assertValidImageData({ width: 0, height: 1, data })).toThrow(RangeError);
    expect(() => assertValidImageData({ width: 1, height: -1, data })).toThrow(RangeError);
    expect(() => assertValidImageData({ width: 1.5, height: 1, data })).toThrow(RangeError);
    expect(() => assertValidImageData({ width: '1' as any, height: 1, data })).toThrow(TypeError);
  });

  it('throws TypeError when data is not a Uint8ClampedArray', () => {
    expect(() => assertValidImageData({ width: 1, height: 1, data: [0, 0, 0, 0] as any })).toThrow(TypeError);
    expect(() => assertValidImageData({ width: 1, height: 1, data: new Uint8Array(4) as any })).toThrow(
      TypeError
    );
  });

  it('throws RangeError when data.length does not match width * height * 4', () => {
    expect(() => assertValidImageData({ width: 2, height: 2, data: new Uint8ClampedArray(8) })).toThrow(
      RangeError
    );
    expect(() => assertValidImageData({ width: 1, height: 1, data: new Uint8ClampedArray(3) })).toThrow(
      RangeError
    );
  });

  it('throws RangeError when data.byteOffset is not 4-byte aligned', () => {
    const buf = new ArrayBuffer(32);
    // length 16 matches 2 * 2 * 4, but byteOffset 2 is not a multiple of 4
    const misaligned = new Uint8ClampedArray(buf, 2, 16);
    expect(() => assertValidImageData({ width: 2, height: 2, data: misaligned })).toThrow(RangeError);
  });
});

describe(assertScaleDividesDimensions, () => {
  it('does not throw when scale divides both dimensions evenly', () => {
    expect(() => assertScaleDividesDimensions(10, 20, 5, 'scale')).not.toThrow();
    expect(() => assertScaleDividesDimensions(12, 12, 1, 'scale')).not.toThrow();
  });

  it('throws RangeError when width is not divisible by scale', () => {
    expect(() => assertScaleDividesDimensions(10, 10, 3, 'scale')).toThrow(RangeError);
  });

  it('throws RangeError when height is not divisible by scale', () => {
    expect(() => assertScaleDividesDimensions(9, 10, 3, 'scale')).toThrow(RangeError);
  });
});
