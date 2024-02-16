import IsomorphicImageData from '@canvas/image-data';
import path from 'node:path';
import sharp from 'sharp';

async function getTestImageData(imageName: string): Promise<ImageData> {
  const src = path.resolve(__dirname, 'images', imageName);
  const image = await sharp(src).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const imageData = new IsomorphicImageData(new Uint8ClampedArray(image.data), image.info.width, image.info.height);
  return imageData as ImageData;
}

export const getPixelTheCatScale1 = () => getTestImageData('pixel-the-cat_x1.png');
export const getPixelTheCatScale5 = () => getTestImageData('pixel-the-cat_x5.png');
export const getPixelTheCatScale32 = () => getTestImageData('pixel-the-cat_x32.png');
export const getWhiteSquareScale100 = () => getTestImageData('white-square_x100.png');
export const getVectorAvatar = () => getTestImageData('vector-avatar.png');
