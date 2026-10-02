// Cloudinary serves resized, modern-format versions on request. Other URLs pass through unchanged.
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!.*\b(?:f_auto|w_\d+))/

export function optimisedImage(url: string | undefined | null, width: number): string | undefined {
  if (!url) return undefined
  return url.replace(CLOUDINARY_UPLOAD, `$1f_auto,q_auto,c_limit,w_${width}/`)
}

export function imageSrcSet(url: string | undefined | null, widths: number[]): string | undefined {
  if (!url || !CLOUDINARY_UPLOAD.test(url)) return undefined
  return widths.map((w) => `${optimisedImage(url, w)} ${w}w`).join(', ')
}
