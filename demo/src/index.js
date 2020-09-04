// eslint-disable-next-line import/no-unresolved
import scalePixels, { getPixelScale } from 'scale-pixels';
import pixelTheCatSrc from '../assets/pixel-the-cat_x5.png';
import './styles.css';
import { loadCanvasFromFile, loadCanvasFromSrc } from './utils/canvas';

const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('file-input');
const catButton = document.getElementById('cat-button');
const toInput = document.getElementById('to-input');
const fromInput = document.getElementById('from-input');
const maxColorDiffInput = document.getElementById('color-diff-input');
const detectScaleButton = document.getElementById('detect-scale-button');
const scaleButton = document.getElementById('scale-button');
const scaleInfo = document.getElementById('scale-info');
let loadedImageData;

function printPixelScale() {
  const maxColorDiff = Number(maxColorDiffInput.value || 0);
  const pixelScale = getPixelScale(loadedImageData, { maxColorDiff });
  scaleInfo.textContent = `Detected pixel scale: ${pixelScale}`;
}

function updateElements() {
  printPixelScale();
  toInput.value = 1;
  maxColorDiffInput.value = 0;
  document.querySelectorAll('input,button').forEach(element => (element.disabled = false));
}

fileInput.addEventListener('change', async event => {
  const file = event.target.files?.[0];

  if (file) {
    loadedImageData = await loadCanvasFromFile(canvas, file);
    updateElements();
  }
});

catButton.addEventListener('click', async () => {
  loadedImageData = await loadCanvasFromSrc(canvas, pixelTheCatSrc);
  updateElements();
});

detectScaleButton.addEventListener('click', async () => {
  printPixelScale();
});

scaleButton.addEventListener('click', async () => {
  if (loadedImageData) {
    const to = Number(toInput.value || 1);
    const from = Number(fromInput.value || undefined);
    const maxColorDiff = Number(maxColorDiffInput.value || 0);
    const scaledImageData = scalePixels(loadedImageData, to, { from, maxColorDiff });

    canvas.width = scaledImageData.width;
    canvas.height = scaledImageData.height;
    canvas.getContext('2d').putImageData(scaledImageData, 0, 0);
    loadedImageData = scaledImageData;
  }
});
