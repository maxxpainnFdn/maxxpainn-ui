
export interface ImageConfig {
  formats: string[];
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  maxSize: number;
}

const imageConfig:ImageConfig = {
  formats: [".jpg", ".jpeg", ".webp", ".png", ".gif"],
  minWidth: 400,
  minHeight: 400,
  maxWidth: 2000,
  maxHeight: 2000,
  maxSize: 5_242_880,
}

const coverImage: ImageConfig = {
  formats: ["jpg", "jpeg", "webp", "png"],
  minWidth:  1600,
  minHeight: 400,
  maxWidth:  1600,
  maxHeight: 400,
  maxSize:   5_242_880,
}

export const profilePhotoConfig = imageConfig;
export const clanImageConfig    = imageConfig;
export const profileCoverConfig = coverImage;
