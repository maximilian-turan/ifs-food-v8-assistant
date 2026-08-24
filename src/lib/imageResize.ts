
export interface ResizedImage {
  base64: string; // no data: URL prefix
  mediaType: "image/jpeg";
}

export async function resizeImageFile(file: File, maxDim = 1568): Promise<ResizedImage> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${file.name}`));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D Context nicht verfügbar');
  ctx.drawImage(img, 0, 0, width, height);

  const outputDataUrl = canvas.toDataURL('image/jpeg', 0.85);
  const base64 = outputDataUrl.split(',')[1];
  return { base64, mediaType: 'image/jpeg' };
}
