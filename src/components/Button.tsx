import CraftLink from "#/components/CraftLink";
import type { CraftLink as CraftLinkData } from "#/lib/craftLink";
import ArrowIcon from "#/svg/arrow.svg?react";
import clsx from "clsx";
import type { AnchorHTMLAttributes } from "react";

type ButtonProps = {
  label: string;
  link: CraftLinkData;
  variant?: "default" | "on-ci" | "on-ci-light";
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
      <span
        className={clsx(
          "px-4.75 pt-3 pb-2.25 text-base leading-snug tracking-wide uppercase",
          {
            "bg-ci-light text-ci-dark":
              variant === "default" || variant === "on-ci",
            "bg-white text-ci-dark": variant === "on-ci-light",
          },
        )}
      >
        {label}
      </span>

      <span
        className={clsx("flex items-center justify-center px-3.5 shrink-0", {
          "bg-white text-ci-dark": variant === "on-ci",
          "bg-ci-dark text-ci-light":
            variant === "default" || variant === "on-ci-light",
        })}
      >
        <ArrowIcon className="w-4 h-4" />
      </span>
    </CraftLink>
  );
}
