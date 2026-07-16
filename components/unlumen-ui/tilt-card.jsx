"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ClippedCircle } from "@/components/unlumen-ui/clipped-circle";
import { Tilt } from "@/components/unlumen-ui/tilt";

const BADGE_LABEL_CLASSES = {
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300"
};

function TiltCard({
  title,
  description,
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  details,
  href,
  children,
  tiltProps,
  className,
  ...props
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasDetails = Array.isArray(details) && details.length > 0;

  const front = <>
      <div className="flex flex-row transition-all duration-200 justify-between px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col gap-1 flex-1 mr-2">
          <h2 className="text-lg tracking-tight leading-tight font-medium">
            {title}
          </h2>
          {description && <p className="text-foreground/50 text-sm">{description}</p>}
          {children && <div className="mt-2">{children}</div>}
        </div>

        {price && badgeLabel ? (
          <div className="inline-flex h-fit items-center text-sm whitespace-nowrap shrink-0">
            <span className="rounded-l-full bg-secondary h-fit py-1 px-2 font-medium">
              {price}
            </span>
            <span className={cn(
              "rounded-r-full text-sm h-fit py-1 px-2 font-medium",
              BADGE_LABEL_CLASSES[badgeVariant]
            )}>
              {badgeLabel}
            </span>
          </div>
        ) : price ? (
          <span className="h-fit rounded-full bg-secondary px-3 py-1 text-sm font-medium whitespace-nowrap shrink-0">
            {price}
          </span>
        ) : null}
      </div>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          width={288}
          height={224}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute z-10 top-27 w-72 -right-10",
            "rotate-[-5deg] border-border border rounded-md",
            "transition-transform duration-300 ease-out",
            "group-hover:-rotate-3 group-hover:-translate-y-1 group-hover:-translate-x-0.5"
          )}
        />
      )}

      {hasDetails && <button
        type="button"
        onClick={() => setIsFlipped(true)}
        className="absolute bottom-4 left-4 z-20 border border-foreground/30 bg-background/70 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em]  transition-colors hover:bg-foreground hover:text-background sm:bottom-5 sm:left-6"
      >
        View details ↗
      </button>}

      <ClippedCircle circleClassName="bg-white" circleSize={800} />
    </>;

  const inner = (
    <Tilt
      rotationFactor={11}
      {...tiltProps}
      className={cn(
        "relative group overflow-hidden",
        "bg-background border border-border rounded-lg",
        "flex flex-col gap-4",
        "h-48 sm:h-52 md:h-56 w-full",
        "hover:shadow-lg hover:scale-105 transition-all duration-400 ease-out",
        className
      )}
    >
      {hasDetails ? <div className="h-full w-full [perspective:1200px]">
          <div
            className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] [transform-style:preserve-3d]"
            style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              {front}
            </div>
            <div
              className="absolute inset-0 flex bg-card p-5 sm:p-6 [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className={cn(
                "flex h-full w-full flex-col transition-[filter,opacity] duration-500 delay-150",
                isFlipped ? "opacity-100 blur-0" : "opacity-0 blur-md"
              )}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/45">Service details</p>
                    <h2 className="mt-1 text-lg font-medium leading-tight tracking-tight">{title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="shrink-0 border border-foreground/30 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors hover:bg-foreground hover:text-background"
                  >
                    Back
                  </button>
                </div>
                <ul className="mt-auto space-y-2 text-sm leading-snug text-foreground/65">
                  {details.map((detail) => <li key={detail} className="flex gap-2"><span className="text-accent">•</span>{detail}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div> : front}
    </Tilt>
  );

  if (href) {
    return <a href={href} className="block cursor-pointer" {...props}>{inner}</a>;
  }
  return <div {...props}>{inner}</div>;
}

export { TiltCard };
