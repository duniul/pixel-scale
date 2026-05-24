import path from 'node:path';
import IsomorphicImageData from '@canvas/image-data';
import sharp from 'sharp';

async function getTestImageData(imageName: string): Promise<ImageData> {
  const src = path.resolve(import.meta.dirname, 'images', imageName);
  const image = await sharp(src).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const imageData = new IsomorphicImageData(
    new Uint8ClampedArray(image.data),
    image.info.width,
    image.info.height
  );
  return imageData as ImageData;
}

export const getPixelTheCatScale1 = (): Promise<ImageData> => getTestImageData('pixel-the-cat_x1.png');
export const getPixelTheCatScale5 = (): Promise<ImageData> => getTestImageData('pixel-the-cat_x5.png');
export const getPixelTheCatScale10 = (): Promise<ImageData> => getTestImageData('pixel-the-cat_x10.png');
export const getWhiteSquareScale100 = (): Promise<ImageData> => getTestImageData('white-square_x100.png');
