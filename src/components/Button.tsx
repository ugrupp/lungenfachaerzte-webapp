import CraftLink from "#/components/CraftLink";
import type { CraftLink as CraftLinkData } from "#/lib/craftLink";
import ArrowIcon from "#/svg/arrow.svg?react";
import clsx from "clsx";
import type { AnchorHTMLAttributes } from "react";

type ButtonProps = {
  label: string;
  link: CraftLinkData;
  variant?: "default" | "on-ci";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export default function Button({
  label,
  link,
  variant = "default",
  className,
  ...rest
}: ButtonProps) {
  return (
    <CraftLink
      link={link}
      className={clsx(
        "inline-flex whitespace-nowrap rounded-br-[15px] overflow-hidden",
        className,
      )}
      {...rest}
    >
      <span className="px-4.75 pt-3 pb-2.25 bg-ci-light text-ci-dark text-base leading-snug tracking-wide uppercase">
        {label}
      </span>

      <span
        className={clsx(
          "flex items-center justify-center px-3.5 shrink-0",
          variant === "on-ci"
            ? "bg-white text-ci-dark"
            : "bg-ci-dark text-ci-light",
        )}
      >
        <ArrowIcon className="w-4 h-4" />
      </span>
    </CraftLink>
  );
}
