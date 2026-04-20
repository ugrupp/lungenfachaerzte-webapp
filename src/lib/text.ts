import { z } from "zod";

// GraphQL fragment for CKEditor rich text fields.
export const TEXT_FRAGMENT = /* GraphQL */ `
  fragment TextFields on text_CkeditorField {
    html
  }
`;

export const TextSchema = z.object({
  html: z.string(),
});

export type Text = z.infer<typeof TextSchema>;
