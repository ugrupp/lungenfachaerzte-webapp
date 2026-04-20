import Button from "#/components/Button";
import Navigation from "#/components/Navigation";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const {
    data: { doctolibLink },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <header className="sticky top-0 z-50 bg-white py-8 container-grid items-start">
      {/* Logo */}
      <Link
        to="/"
        className="ml-(--logo-offset) col-start-[content] h-[95.37px] w-fit"
      >
        <Logo className="h-full w-auto" />
        <span className="sr-only">Zur Startseite</span>
      </Link>

      {/* Termin vereinbaren */}
      {doctolibLink && (
        <Button
          label={doctolibLink.label ?? doctolibLink.defaultLabel}
          link={doctolibLink}
          className="max-896:hidden w-fit col-start-11 1024:col-start-7"
        />
      )}

      {/* Navigation */}
      <div
        className="col-end-[content-end] w-fit justify-self-end"
        id="navigation"
      >
        {/* Desktop navigation */}
        <Navigation className="max-1280:hidden" />

        {/* Mobile toggle */}
        <button className="1280:hidden h-11 w-11 rounded-full bg-ci-light flex items-center justify-center">
          <span className="sr-only">Menü einblenden</span>
        </button>
      </div>
    </header>
  );
}
