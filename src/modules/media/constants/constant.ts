export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
] as const;

export type VideoMimeType = (typeof VIDEO_MIME_TYPES)[number];

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

export const DOC_MIME_TYPES = ["application/pdf"] as const;

export type DocMimeType = (typeof DOC_MIME_TYPES)[number];

export const ACCEPTED_MIME_TYPES = [
  ...VIDEO_MIME_TYPES,
  ...IMAGE_MIME_TYPES,
  ...DOC_MIME_TYPES,
] as const;

export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];
