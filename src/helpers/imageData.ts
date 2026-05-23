import type { ImageDataLike } from '../types';

export function isValidImageData(item: unknown): item is ImageDataLike {
  const idl = item as ImageDataLike;

  return !!(
    idl &&
    typeof idl.width === 'number' &&
    typeof idl.height === 'number' &&
    idl.data?.length === idl.width * idl.height * 4
  );
}
