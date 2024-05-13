import type { ImageDataLike } from '../types.js';

export function isValidImageData(imageData: ImageDataLike): imageData is ImageDataLike {
  return !!(
    imageData &&
    typeof imageData.width === 'number' &&
    typeof imageData.height === 'number' &&
    imageData.data?.length === imageData.width * imageData.height * 4
  );
}
