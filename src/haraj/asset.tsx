import type { ImgHTMLAttributes } from "react";

/** Local copy path for a remote image (filled by `node scripts/fetch-assets.mjs`). */
export function localPath(url: string) {
  if (url.startsWith("/")) return url; // already a file in public/
  const u = new URL(url);
  const name = decodeURIComponent(u.pathname.split("/").pop() || "img").replace(/[^\w.\-]+/g, "_");
  const dir = u.hostname.includes("haraj") ? "haraj" : "photos";
  return `/assets/${dir}/${name}`;
}

/** Uses the local copy when it exists, otherwise falls back to the original online image. */
export function Img({ src, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  return (
    <img
      {...rest}
      src={localPath(src)}
      onError={(e) => {
        const el = e.currentTarget;
        if (el.dataset.fallback) return;
        el.dataset.fallback = "1";
        el.src = src;
      }}
    />
  );
}
