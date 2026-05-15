import { nullToUndefined } from "#/lib/helpers";
import { z } from "zod";

export function imageFragment(widths: readonly number[], name = "ImageFields") {
  const urlFields = widths
    .map(
      (w) =>
        `url${w}: url @transform(width: ${w}, format: "webp", quality: 99)`,
    )
    .join("\n    ");
  return /* GraphQL */ `
    fragment ${name} on AssetInterface {
      ${urlFields}
      alt
      title
      focalPoint
    }
  `;
}

export function imageSchema(widths: readonly number[]) {
  const urlShape = Object.fromEntries(
    widths.map((w) => [`url${w}`, z.string()]),
  );

  const ImageSchemaPreTransform = z.object({
    ...urlShape,
    alt: z.string().apply(nullToUndefined),
    title: z.string().apply(nullToUndefined),
    focalPoint: z.tuple([z.number(), z.number()]).apply(nullToUndefined),
  });

  return ImageSchemaPreTransform.transform((data) => {
    const d = data as Record<string, string> &
      z.infer<typeof ImageSchemaPreTransform>;
    const srcset = widths.map((w) => `${d[`url${w}`]} ${w}w`).join(", ");
    return {
      srcset,
      url: d[`url${widths[0]}`],
      alt: data.alt || data.title,
      focalPoint: data.focalPoint,
    };
  });
}

export type Image = {
  srcset: string;
  url: string;
  alt?: string;
  focalPoint?: [number, number];
};
