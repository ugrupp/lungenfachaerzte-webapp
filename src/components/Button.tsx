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
        "group inline-flex whitespace-nowrap rounded-br-[15px] overflow-hidden",
        {
          "bg-ci-light": variant === "default" || variant === "on-ci",
          "bg-white": variant === "on-ci-light",
        },
        className,
      )}
      {...props}
    >
      {/* Text */}
      <span
        className={clsx(
          "px-4.75 pt-3 pb-2.25 text-base leading-snug tracking-wide uppercase text-ci-dark",
        )}
      >
        <span className="transition-transform duration-250 group-hover:translate-x-0.5 inline-block">
          {children}
        </span>
      </span>

      {/* Icon wrapper */}
      <span
        className={clsx(
          "relative flex items-center justify-center px-3.5 shrink-0 overflow-hidden",
          {
            "text-ci-dark": variant === "on-ci",
            "text-ci-light": variant === "default" || variant === "on-ci-light",
          },
        )}
      >
        {/* Background that slides out on hover */}
        <span
          className={clsx(
            "absolute inset-0 translate-x-0 transition-transform duration-250 ease-in-out group-hover:translate-x-full",
            {
              "bg-ci-dark": variant === "default" || variant === "on-ci-light",
              "bg-white": variant === "on-ci",
            },
          )}
        />
        {/* Icon */}
        <ArrowIcon
          className={clsx(
            "relative z-10 w-4 h-4 translate-x-0 transition-all duration-250 group-hover:translate-x-1",
            {
              "group-hover:text-ci-dark":
                variant === "default" || variant === "on-ci-light",
            },
          )}
        />
      </span>
    </a>
  );
}
