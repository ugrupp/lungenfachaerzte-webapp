import Navigation from "#/components/Navigation";
import Logo from "#/svg/logo.svg?react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b flex gap-x-64 items-center">
      <Logo />
      <Navigation />
    </header>
  );
}
