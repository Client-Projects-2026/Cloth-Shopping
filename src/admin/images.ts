export interface PreparedImage {
  blob: Blob;
  preview: string;
  thumbnail?: Blob;
  width: number;
  height: number;
}

function asWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== 'image/webp')
          reject(
            new Error(
              'This browser cannot convert images to WebP. Try a current Chrome, Edge, Firefox or Safari.',
            ),
          );
        else if (blob.size > 4 * 1024 * 1024)
          reject(new Error('The converted image is over 4 MB. Choose a smaller source image.'));
        else resolve(blob);
      },
      'image/webp',
      0.88,
    ),
  );
}

function canvas(width: number, height: number): HTMLCanvasElement {
  const element = document.createElement('canvas');
  element.width = width;
  element.height = height;
  return element;
}

export async function prepareGarmentImage(
  file: File,
  requireCutout: boolean,
): Promise<PreparedImage> {
  if (!['image/png', 'image/webp', 'image/jpeg'].includes(file.type))
    throw new Error('Choose a PNG, WebP or JPEG image.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Choose a source image smaller than 8 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width < 400 || bitmap.height < 400)
      throw new Error('Use an image at least 400 × 400 pixels for a clear garment view.');
    if (bitmap.width > 8000 || bitmap.height > 8000 || bitmap.width * bitmap.height > 32000000)
      throw new Error(
        'This image is too large to process. Resize it below 8000 pixels on each side.',
      );
    if (requireCutout) {
      const sample = canvas(128, 128);
      const context = sample.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Image conversion is unavailable in this browser.');
      context.drawImage(bitmap, 0, 0, 128, 128);
      const pixels = context.getImageData(0, 0, 128, 128).data;
      let transparent = 0;
      for (let index = 3; index < pixels.length; index += 4) if (pixels[index] < 245) transparent++;
      if (transparent < 160)
        throw new Error(
          'The front image needs a transparent background. Export a cutout PNG or WebP first; a JPEG background cannot be removed accurately here.',
        );
    }
    const full = canvas(1200, 1600);
    const context = full.getContext('2d');
    if (!context) throw new Error('Image conversion is unavailable in this browser.');
    const scale = Math.min(1100 / bitmap.width, 1500 / bitmap.height);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    context.drawImage(
      bitmap,
      Math.round((1200 - width) / 2),
      Math.round((1600 - height) / 2),
      width,
      height,
    );
    const blob = await asWebp(full);
    let thumbnail: Blob | undefined;
    if (requireCutout) {
      const rack = canvas(420, 560);
      rack.getContext('2d')!.drawImage(full, 0, 0, 420, 560);
      thumbnail = await asWebp(rack);
    }
    return {
      blob,
      thumbnail,
      preview: URL.createObjectURL(blob),
      width: bitmap.width,
      height: bitmap.height,
    };
  } finally {
    bitmap.close();
  }
}
