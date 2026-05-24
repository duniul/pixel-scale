import type { getPixelScale } from './getPixelScale.js'; // oxlint-disable-line no-unused-vars
import type { scalePixels, multiplyPixelScale, dividePixelScale } from './scalePixels.js'; // oxlint-disable-line no-unused-vars

/**
 * The pixel buffer used by {@link ImageDataLike}: a flat `Uint8ClampedArray` of RGBA
 * bytes in row-major order, with a length of `width * height * 4`.
 */
export type ImageDataLikeData = Uint8ClampedArray;

/**
 * Minimal structural shape compatible with the standard
 * [`ImageData`](https://developer.mozilla.org/docs/Web/API/ImageData) interface.
 */
export type ImageDataLike = {
  data: ImageDataLikeData;
  height: number;
  width: number;
};

type SharedPixelScaleOptions = {
  /**
   * Maximum allowed per-channel difference (0–255) when comparing pixels during
   * scale detection. Useful for images from lossy formats (e.g. JPEG) where
   * visually identical pixels may differ slightly. Ignored when `from` is set.
   *
   * @default 0
   */
  maxColorDiff?: number;
};

/**
 * Options accepted by {@link scalePixels}, {@link multiplyPixelScale}, and {@link dividePixelScale}.
 */
export type ScalePixelsOptions = SharedPixelScaleOptions & {
  /**
   * The current pixel scale of the input image. If omitted, it is detected
   * automatically with `getPixelScale`. Provide this only when the current
   * scale is already known, to skip detection.
   */
  from?: number;
};

/**
 * Options accepted by {@link getPixelScale}.
 */
export type GetPixelScaleOptions = SharedPixelScaleOptions;
