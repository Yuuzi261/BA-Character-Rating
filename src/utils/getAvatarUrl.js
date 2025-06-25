import { getAssetsFile } from "./getAssetsFile";

export function getAvatarUrl(id) {
  if (id === null || id === undefined) return '';
  return getAssetsFile(`avatar/${id}.webp`);
}