// Compresión de imágenes en el navegador usando canvas.
// Redimensiona y, si el base64 sigue pesando más del objetivo, baja calidad
// en iteraciones hasta cumplir. Devuelve un data URI JPEG.

const base64Bytes = (dataUri) => {
  const b64 = dataUri.split(",")[1] || "";
  return Math.ceil((b64.length * 3) / 4);
};

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function draw(img, maxWidth, quality) {
  const scale = Math.min(1, maxWidth / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function compressFileToBase64(
  file,
  { maxWidth = 800, maxBytes = 200 * 1024, minWidth = 200, minQuality = 0.2 } = {}
) {
  const img = await loadImage(file);
  let width = maxWidth;
  let quality = 0.6;
  let uri = draw(img, width, quality);
  let attempts = 0;

  while (base64Bytes(uri) > maxBytes && attempts < 6) {
    attempts += 1;
    quality = Math.max(minQuality, quality - 0.12);
    width = Math.max(minWidth, Math.round(width * 0.82));
    uri = draw(img, width, quality);
    if (width === minWidth && quality === minQuality) break;
  }

  return { uri, bytes: base64Bytes(uri) };
}
