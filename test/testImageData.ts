import ImageData from '@canvas/image-data';
import sharp from 'sharp';
import path from 'path';

async function getTestImageData(imageName: string) {
  const src = path.resolve(__dirname, 'images', imageName);
  const image = await sharp(src).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  return new ImageData(new Uint8ClampedArray(image.data), image.info.width, image.info.height);
}

export const getPixelTheCatScale1 = () => getTestImageData('pixel-the-cat_x1.png');
export const getPixelTheCatScale5 = () => getTestImageData('pixel-the-cat_x5.png');
export const getPixelTheCatScale32 = () => getTestImageData('pixel-the-cat_x32.png');
export const getWhiteSquareScale100 = () => getTestImageData('white-square_x100.png');
export const getVectorAvatar = () => getTestImageData('vector-avatar.png');
