import type { ImageDataLike } from '../types.js';

export function assertMinInteger(value: unknown, min: number, name: string): asserts value is number {
  if (typeof value !== 'number') {
    throw new TypeError(`${name} must be a number, received ${typeof value} (${String(value)})`);
  }
  if (!Number.isInteger(value) || value < min) {
    throw new RangeError(`${name} must be an integer at least ${min}, received ${value}`);
  }
}

export function assertValidImageData(
  imageData: unknown,
  name = 'imageData'
): asserts imageData is ImageDataLike {
  if (!imageData || typeof imageData !== 'object') {
    throw new TypeError(`${name} must be an object with data, width, and height.`);
  }

  const { data, width, height } = imageData as { data?: unknown; width?: unknown; height?: unknown };

  assertMinInteger(width, 1, `${name}.width`);
  assertMinInteger(height, 1, `${name}.height`);

  if (!(data instanceof Uint8ClampedArray)) {
    throw new TypeError(`${name}.data must be a Uint8ClampedArray`);
  }

  const expectedLength = width * height * 4;
  if (data.length !== expectedLength) {
    throw new RangeError(
      `${name}.data.length (${data.length}) must equal width * height * 4 (${expectedLength})`
    );
  }

  // required so that getPixelScale can safely read `data` as a Uint32Array view.
  if (data.byteOffset % 4 !== 0) {
    throw new RangeError(`${name}.data must be 4-byte aligned (data.byteOffset is ${data.byteOffset})`);
  }
}

export function assertScaleDividesDimensions(
  width: number,
  height: number,
  scale: number,
  scaleName: string
): void {
  if (width % scale !== 0) {
    throw new RangeError(`width (${width}) must be divisible by ${scaleName} (${scale})`);
  }
  if (height % scale !== 0) {
    throw new RangeError(`height (${height}) must be divisible by ${scaleName} (${scale})`);
  }
}
