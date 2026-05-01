import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Ellipsis from "#/svg/ellipsis.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

const getPathname = (href: string): string => {
  try {
    return new URL(href).pathname;
  } catch {
    return href;
  }
};

type Props = ComponentPropsWithoutRef<"nav">;

export default function Navigation(props: Props) {
  const {
    data: { navigation: navItems },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
  });

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      {...props}
      className={clsx(
        "bg-off-white rounded-full overflow-hidden",
        props.className,
      )}
    >
      <ul className="flex items-center justify-center">
        {navItems.map(({ id, link }, index) => {
          const isActive = getPathname(link.href) === pathname;
          return (
            <li key={id} className="group relative">
              <a
                href={link.href}
                target={link.target}
                rel={
                  link.target === "_blank" ? "noopener noreferrer" : undefined
                }
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "block px-5 pt-3 pb-1.5 text-16 leading-snug tracking-wide text-ci-dark uppercase group-last-of-type:pr-8 group-first-of-type:pl-8 border-b-3 hover:border-ci-light focus-visible:border-ci-light focus-visible:outline-none transition-colors duration-200",
                  isActive ? "border-ci-light" : "border-transparent",
                )}
              >
                {link.label ?? link.defaultLabel}

                {index < navItems.length - 1 && (
                  <Ellipsis
                    aria-hidden="true"
                    className="absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.75 pointer-events-none text-ci-light"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
