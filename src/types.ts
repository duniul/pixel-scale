export type ImageDataLikeData = Uint8ClampedArray | number[];

export interface ImageDataLike {
  data: ImageDataLikeData;
  height: number;
  width: number;
}

export interface ScalePixelsOptions {
  from?: number;
  maxColorDiff?: number;
}

export interface GetPixelScaleOptions {
  maxColorDiff?: number;
}
