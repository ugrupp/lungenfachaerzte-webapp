import type { CraftLink } from "#/lib/craftLink";
import type { AnchorHTMLAttributes } from "react";

type CraftLinkProps = {
  link: CraftLink;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Renders a plain `<a>` for all Craft links — both internal and external.
 * MPA navigation: full-page reloads let the CDN serve cached responses.
 */
export default function CraftLink({ link, children, ...rest }: CraftLinkProps) {
  return (
    <a
      href={link.href}
      target={link.target}
      rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
