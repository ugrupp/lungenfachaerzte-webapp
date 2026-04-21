import type { Image } from "#/lib/image";
import type { ComponentPropsWithoutRef } from "react";

function applyLoadedClass(img: HTMLImageElement | null) {
  if (!img) return;
  const mark = () => img.classList.add("loaded");
  if (img.complete) {
    mark();
  } else {
    img.addEventListener("load", mark, { once: true });
  }
}

type Props = Omit<ComponentPropsWithoutRef<"img">, "loading"> & {
  focalPoint?: Image["focalPoint"];
};

export function Image({ className, focalPoint, style, ...props }: Props) {
  return (
    <img
      ref={applyLoadedClass}
      loading="lazy"
      className={[
        "opacity-0 transition-opacity duration-500 [&.loaded]:opacity-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        objectPosition: focalPoint
          ? `${focalPoint[0] * 100}% ${focalPoint[1] * 100}%`
          : undefined,
        ...style,
      }}
      {...props}
    />
  );
}
