const MAX_BYTES = 50 * 1024; // strict 50 KB ceiling
const MAX_DIMENSION = 1280; // longest edge before we even start compressing

/**
 * Compresses an image file down to strictly under 50 KB, output as JPEG.
 * Strategy: draw to a canvas, then binary-search JPEG quality; if quality
 * alone can't get there, progressively downscale the canvas and retry.
 */
export async function compressImageToUnder50KB(file: File): Promise<File> {
  const bitmap = await loadImage(file);
  let { width, height } = bitmap;

  // Cap the starting resolution so we're not wasting compression passes on
  // an enormous source photo.
  const scaleToFit = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  width = Math.round(width * scaleToFit);
  height = Math.round(height * scaleToFit);

  let attempt = 0;
  const maxDownscaleAttempts = 8;

  while (attempt < maxDownscaleAttempts) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported in this browser.');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await binarySearchQuality(canvas);
    if (blob && blob.size <= MAX_BYTES) {
      return new File([blob], toJpgName(file.name), { type: 'image/jpeg' });
    }

    // Still too big even at lowest quality — shrink dimensions and retry.
    width = Math.round(width * 0.8);
    height = Math.round(height * 0.8);
    attempt++;
  }

  throw new Error('Could not compress image under 50 KB. Try a smaller photo.');
}

function toJpgName(originalName: string): string {
  const base = originalName.replace(/\.[^/.]+$/, '');
  return `${base}.jpg`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image file.'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}

async function binarySearchQuality(canvas: HTMLCanvasElement): Promise<Blob | null> {
  let low = 0.1;
  let high = 0.92;
  let best: Blob | null = null;

  for (let i = 0; i < 7; i++) {
    const mid = (low + high) / 2;
    const blob = await canvasToBlob(canvas, mid);
    if (!blob) break;

    if (blob.size <= MAX_BYTES) {
      best = blob;
      low = mid; // try to squeeze a bit more quality out of the remaining budget
    } else {
      high = mid;
    }
  }

  // Final fallback pass at the floor quality, in case the loop never
  // landed under budget (very detailed image).
  if (!best) {
    best = await canvasToBlob(canvas, 0.1);
  }

  return best;
}
