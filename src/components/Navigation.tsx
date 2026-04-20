import CraftLink from "#/components/CraftLink";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Ellipsis from "#/svg/ellipsis.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"nav">;
export default function Navigation(props: Props) {
  const {
    data: { navigation: navItems },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <nav
      {...props}
      className={`bg-off-white rounded-full overflow-hidden ${props.className ?? ""}`}
    >
      <ul className="flex items-center justify-center">
        {navItems.map(({ id, link }, index) => {
          return (
            <li key={id} className="group relative">
              <CraftLink
                link={link}
                className="block px-5 pt-3 pb-1.5 text-16 leading-snug tracking-wide text-ci-dark uppercase group-last-of-type:pr-8 group-first-of-type:pl-8 border-b-3 border-transparent hover:border-ci-light transition-colors duration-200"
                activeProps={{ className: "border-ci-light!" }}
                activeOptions={{ exact: true }}
              >
                {link.label ?? link.defaultLabel}

                {index < navItems.length - 1 && (
                  <Ellipsis
                    aria-hidden="true"
                    className="absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.75 pointer-events-none text-ci-light"
                  />
                )}
              </CraftLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
