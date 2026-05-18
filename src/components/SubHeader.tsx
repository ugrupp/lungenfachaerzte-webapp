import type { Image } from "#/lib/image";
import Doctors from "#/svg/doctors.svg?react";
import clsx from "clsx";
import type React from "react";
import { Image as ImageCmp } from "./Image";

export type SubHeaderVariant = "default" | "tall";

type Props = {
  heroImage?: Image;
  variant?: SubHeaderVariant;
};

// Header height is fixed: py-8 (32px top + 32px bottom) + logo (95.36px) = 159.36px
const HEADER_HEIGHT = 159.36;
// Doctors SVG intrinsic height (53px) + gap-y-8 (32px) — only on mobile where the
// image sits below the SVG in flow. At 1024px+ the image shares the same grid row.
const DOCTORS_OFFSET = 53 + 32;

export default function SubHeader({ heroImage, variant = "default" }: Props) {
  return (
    <section
      className={clsx("container-grid gap-y-8", {
        "pb-8": !heroImage,
      })}
    >
      <Doctors className="col-start-[content]" />

      {!!heroImage && (
        <div
          className={clsx(
            "max-1024:ml-(--logo-offset) col-[content/full] 1024:col-[7/content] overflow-hidden",
            {
              "h-(--tall-h-sm) 768:h-(--tall-h-md) 1024:h-(--tall-h-lg) min-h-50 rounded-bl-[50px]":
                variant === "tall",
              "h-30 768:h-38": variant === "default",
            },
          )}
          style={
            variant === "tall"
              ? ({
                  // <768px and 768–1023px: image is below the Doctors SVG in flow
                  "--tall-h-sm": `calc(100svh - ${HEADER_HEIGHT + DOCTORS_OFFSET}px - 120px)`,
                  "--tall-h-md": `calc(100svh - ${HEADER_HEIGHT + DOCTORS_OFFSET}px - 200px)`,
                  // ≥1024px: image shares the same grid row as the Doctors SVG
                  "--tall-h-lg": `calc(100svh - ${HEADER_HEIGHT}px - 200px)`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <ImageCmp
            src={heroImage.url}
            srcSet={heroImage.srcset}
            alt={heroImage.alt ?? ""}
            focalPoint={heroImage.focalPoint}
            sizes="100vw"
            className="size-full object-cover"
            loading="eager"
          />
        </div>
      )}
    </section>
  );
}
