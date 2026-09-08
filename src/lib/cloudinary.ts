const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

/**
 * Direct unsigned upload to Cloudinary. Returns the secure HTTPS URL of the
 * uploaded image. If Cloudinary isn't configured (no env vars set), falls
 * back to a local object URL so the app still works end-to-end in dev/demo
 * mode without any backend credentials.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    // Demo fallback: keep the image in-memory as an object URL. This never
    // persists across reloads, but lets the full create/preview flow work
    // without requiring real Cloudinary credentials.
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET as string);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Image upload failed. Please try again.');
  }

  const data = await response.json();
  return data.secure_url as string;
}
