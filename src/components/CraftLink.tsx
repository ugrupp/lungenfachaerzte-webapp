import type { CraftLink } from "#/lib/craftLink";
import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

type ControlledProps = "to" | "href" | "target" | "rel" | "children";

// Intersect LinkProps with AnchorHTMLAttributes so className, onClick, style,
// data-* etc. are all available, as are TanStack-specific props.
type CraftLinkProps = {
  link: CraftLink;
  children: React.ReactNode;
} & Omit<LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>, ControlledProps>;

/**
 * Renders a TanStack `<Link>` for internal Craft links (entries, assets, …)
 * and a plain `<a>` for external URLs, emails, and other non-internal types.
 * TanStack-specific props (activeProps, activeOptions, preload, …) are passed
 * through for internal links and silently ignored for external ones.
 */
export default function CraftLink({ link, children, ...rest }: CraftLinkProps) {
  if (link.isExternal) {
    return (
      <a
        href={link.href}
        target={link.target}
        rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={link.href as "/"}
      target={link.target}
      rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </Link>
  );
}
