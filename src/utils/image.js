// Helper to build a safe image src from MongoDB-stored images
// Supports: { contentType, data: base64String } OR { contentType, data: { data: Uint8Array | number[] } }
export function getImageSrc(image) {
  if (!image || !image.contentType || !image.data) return '';

  // If already base64 string
  if (typeof image.data === 'string') {
    return `data:${image.contentType};base64,${image.data}`;
  }

  // If binary buffer-like: { data: [...] }
  try {
    const raw = image.data && image.data.data ? image.data.data : image.data;
    const uint8 = raw instanceof Uint8Array ? raw : new Uint8Array(raw || []);
    const blob = new Blob([uint8], { type: image.contentType });
    return URL.createObjectURL(blob);
  } catch (e) {
    // Fallback: empty src
    return '';
  }
}


