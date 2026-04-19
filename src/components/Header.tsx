import Button from "#/components/Button";
import Navigation from "#/components/Navigation";
import { makeCraftLink } from "#/lib/craftLink";
import Logo from "#/svg/logo.svg?react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b flex gap-x-64 items-center">
      <Logo />
      <Button label="Termin vereinbaren" link={makeCraftLink("/termin")} />
      <Navigation />
    </header>
  );
}
