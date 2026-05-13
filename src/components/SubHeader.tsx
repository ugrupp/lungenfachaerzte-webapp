import type { Image } from "#/lib/image";
import Doctors from "#/svg/doctors.svg?react";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Image as ImageCmp } from "./Image";

export type SubHeaderVariant = "default" | "tall";

type Props = {
  mainImage?: Image;
  variant?: SubHeaderVariant;
};

export default function SubHeader({ mainImage, variant = "default" }: Props) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "tall") return;

    const imageWrapper = imageWrapperRef.current;
    if (!imageWrapper) return;

    const updateOffset = () => {
      const offset = Math.max(0, imageWrapper.getBoundingClientRect().top);
      imageWrapper.style.setProperty("--subheader-offset", `${offset}px`);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("resize", updateOffset);
      imageWrapper.style.removeProperty("--subheader-offset");
    };
  }, [variant]);

  return (
    <section className="container-grid gap-y-8">
      <Doctors className="col-start-[content]" />

      <div
        ref={imageWrapperRef}
        className={clsx(
          "max-1024:ml-(--logo-offset) col-[content/full] 1024:col-[7/content] bg-ci-dark overflow-hidden",
          {
            "h-[calc(100vh-var(--subheader-offset)-120px)] 768:h-[calc(100vh-var(--subheader-offset)-200px)] min-h-50 rounded-bl-[50px]":
              variant === "tall",
            "h-30 768:h-38": variant === "default",
          },
        )}
      >
        {!!mainImage && (
          <ImageCmp
            src={mainImage.url}
            srcSet={mainImage.srcset}
            alt={mainImage.alt ?? ""}
            focalPoint={mainImage.focalPoint}
            sizes="100vw"
            className="size-full object-cover"
          />
        )}
      </div>
    </section>
  );
}
