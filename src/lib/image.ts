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
      focalPoint
    }
  `;
}

export function imageSchema(widths: readonly number[]) {
  const urlShape = Object.fromEntries(
    widths.map((w) => [`url${w}`, z.string()]),
  );

  const BaseSchema = z.object({
    ...urlShape,
    alt: z.string().nullable(),
    focalPoint: z.tuple([z.number(), z.number()]).nullable(),
  });

  return BaseSchema.transform((data) => {
    const d = data as Record<string, string> & z.infer<typeof BaseSchema>;
    const srcset = widths.map((w) => `${d[`url${w}`]} ${w}w`).join(", ");
    return {
      srcset,
      url: d[`url${widths[0]}`],
      alt: data.alt,
      focalPoint: data.focalPoint,
    };
  });
}

export type Image = {
  srcset: string;
  url: string;
  alt: string | null;
  focalPoint: [number, number] | null;
};
