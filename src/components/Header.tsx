import Button from "#/components/Button";
import DesktopMenu from "#/components/DesktopMenu";
import MobileMenuToggle from "#/components/MobileMenuToggle";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Header() {
  const {
    data: { doctolibLink },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
  });

  return (
    <header className="sticky top-0 z-50 bg-white py-8 container-grid items-start">
      {/* Logo */}
      <a
        href="/"
        className="ml-(--logo-offset) col-start-[content] h-[95.37px] w-fit"
      >
        <Logo className="h-full w-auto" />
        <span className="sr-only">Zur Startseite</span>
      </a>

      {/* Termin vereinbaren */}
      {doctolibLink && (
        <Button
          href={doctolibLink.href}
          target={doctolibLink.target}
          rel={
            doctolibLink.target === "_blank" ? "noopener noreferrer" : undefined
          }
          className="max-896:hidden w-fit col-start-11 1024:col-start-7"
        >
          {doctolibLink.label ?? doctolibLink.defaultLabel}
        </Button>
      )}

      {/* Navigation */}
      <div
        className="col-end-[content-end] w-fit justify-self-end"
        id="navigation"
      >
        <DesktopMenu className="max-1280:hidden" />
        <MobileMenuToggle />
      </div>
    </header>
  );
}
