import { z } from "zod";

export function imageFragment(widths: readonly number[], name = "ImageFields") {
  const urlFields = widths
    .map((w) => `url${w}: url @transform(width: ${w}, format: "webp")`)
    .join("\n    ");
  return /* GraphQL */ `
    fragment ${name} on AssetInterface {
      ${urlFields}
      alt
    }
  `;
}

export function imageSchema(widths: readonly number[]) {
  const urlShape = Object.fromEntries(
    widths.map((w) => [`url${w}`, z.string()]),
  ) as Record<string, z.ZodString>;

  return z
    .object({ ...urlShape, alt: z.string().nullable() })
    .transform((data) => {
      const d = data as Record<string, string> & { alt: string | null };
      const srcset = widths.map((w) => `${d[`url${w}`]} ${w}w`).join(", ");
      return {
        srcset,
        url: d[`url${widths[0]}`],
        alt: data.alt,
      };
    });
}

export type ImageResult = {
  srcset: string;
  url: string;
  alt: string | null;
};
