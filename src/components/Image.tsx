import type { Image } from "#/lib/image";
import clsx from "clsx";
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

type Props = ComponentPropsWithoutRef<"img"> & {
  focalPoint?: Image["focalPoint"];
};

export function Image({
  className,
  focalPoint,
  loading = "lazy",
  style,
  ...props
}: Props) {
  return (
    <img
      ref={applyLoadedClass}
      loading={loading}
      className={clsx([
        {
          "opacity-0 transition-opacity duration-500 [&.loaded]:opacity-100":
            loading === "lazy",
        },
        className,
      ])}
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
