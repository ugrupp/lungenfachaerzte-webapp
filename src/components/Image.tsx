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

type Props = Omit<ComponentPropsWithoutRef<"img">, "loading">;

export function Image({ className, ...props }: Props) {
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
      {...props}
    />
  );
}
