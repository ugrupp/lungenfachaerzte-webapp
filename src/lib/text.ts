import sanitizeHtml from "sanitize-html";
import { z } from "zod";

// GraphQL fragment for CKEditor rich text fields.
export const TEXT_FRAGMENT = /* GraphQL */ `
  fragment TextFields on text_CkeditorField {
    html
  }
`;

export const TextSchema = z
  .object({
    html: z.string(),
  })
  .transform((val) => ({
    __html: sanitizeHtml(val.html, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["class", "id"],
        a: ["href", "name", "target", "rel"],
        img: ["src", "srcset", "alt", "width", "height", "loading"],
      },
    }),
  }));

export type Text = z.infer<typeof TextSchema>;
