import type { Image } from "#/lib/image";
import Doctors from "#/svg/doctors.svg?react";
import clsx from "clsx";
import { Image as ImageCmp } from "./Image";

export type SubHeaderVariant = "default" | "tall";

// TODO: sizing
type Props = {
  mainImage?: Image;
  variant?: SubHeaderVariant;
};

export default function SubHeader({ mainImage, variant = "default" }: Props) {
  return (
    <section className="container-grid gap-y-8">
      <Doctors className="col-start-[content]" />

      <div
        className={clsx(
          "max-1024:ml-(--logo-offset) col-[content/full] 1024:col-[7/content] bg-ci-dark overflow-hidden",
          {
            "h-100 rounded-bl-[50px]": variant === "tall",
            "h-37": variant === "default",
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
