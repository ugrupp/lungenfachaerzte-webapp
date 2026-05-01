import ArrowIcon from "#/svg/arrow.svg?react";
import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export default function Button({
  children,
  variant = "default",
  className,
  ...props
}: ComponentPropsWithoutRef<"a"> & {
  variant?: "default" | "on-ci" | "on-ci-light";
}) {
  return (
    <a
      className={clsx(
        "inline-flex whitespace-nowrap rounded-br-[15px] overflow-hidden",
        className,
      )}
      {...props}
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
        {children}
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
    </a>
  );
}
