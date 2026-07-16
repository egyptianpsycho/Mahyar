"use client";
import { OptimizedImage } from "./OptimizedImage";
function Placeholder({
  label,
  kind = "photo",
  className = "",
  index,
  seed,
  width = 800,
  height = 1e3,
  onLoad
}) {
  const s = seed ?? index ?? label ?? "mahyar";
  const safeSeed = encodeURIComponent(String(s));
  const imgUrl = `https://picsum.photos/seed/${safeSeed}/${width}/${height}`;
  return <div
    className={`relative w-full h-full overflow-hidden bg-placeholder ring-1 ring-foreground/5 ${className}`}
  >
      <OptimizedImage
        src={imgUrl}
        alt={label ?? `Placeholder ${index ?? ""}`}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        onLoad={onLoad}
      />
      {
    /* subtle dark tint to keep the editorial feel */
  }
      <div className="absolute inset-0 bg-background/25 mix-blend-multiply" />

      <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-foreground/40" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-foreground/40" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-foreground/40" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-foreground/40" />

      {kind === "video" && <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-14 rounded-full border border-foreground/60 flex items-center justify-center backdrop-blur-sm bg-background/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground translate-x-[1px]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>}

      {label && <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.25em] uppercase text-foreground/80">
          {label}
        </span>}
    </div>;
}
export {
  Placeholder
};
