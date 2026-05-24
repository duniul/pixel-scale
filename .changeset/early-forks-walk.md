---
'pixel-scale': patch
---

Speed up `scalePixels` by preallocating the output `Uint8ClampedArray` (up to 8x faster).
