import Button from "#/components/Button";
import Navigation from "#/components/Navigation";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Header() {
  const {
    data: { doctolibLink },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <header className="sticky top-0 z-50 border-b flex gap-x-64 items-center">
      <Logo />
      {doctolibLink && (
        <Button
          label={doctolibLink.label ?? doctolibLink.defaultLabel}
          link={doctolibLink}
        />
      )}
      <Navigation />
    </header>
  );
}
