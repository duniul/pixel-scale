export type ImageDataLikeData = Uint8ClampedArray | number[];

export type ImageDataLike = {
  data: ImageDataLikeData;
  height: number;
  width: number;
};

export type ScalePixelsOptions = {
  from?: number;
  maxColorDiff?: number;
};

export type GetPixelScaleOptions = {
  maxColorDiff?: number;
};
