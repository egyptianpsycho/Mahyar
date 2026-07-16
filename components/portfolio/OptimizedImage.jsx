"use client";

import Image from "next/image";
import { useState } from "react";

// A tiny neutral placeholder keeps slow external images from flashing black.
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxmaWx0ZXIgaWQ9ImIiPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzE2MTYxOCIvPjwvc3ZnPg==";

function OptimizedImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  fill = true,
  width,
  height,
  onLoad,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const finishLoading = (event) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  return <>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        onLoad={finishLoading}
        onError={finishLoading}
        className={className}
        {...props}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center bg-background/20 transition-opacity duration-300 ${isLoaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <span className="size-6 animate-spin rounded-full border-2 border-foreground/30 border-t-accent" />
      </span>
    </>;
}

export { OptimizedImage };
