import Button from "#/components/Button";
import MobileMenu from "#/components/MobileMenu";
import Navigation from "#/components/Navigation";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Ellipsis from "#/svg/ellipsis.svg?react";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Header() {
  const {
    data: { doctolibLink },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
  });

  const [menuOpen, setMenuOpen] = useState(false);
  // stays true during exit animation so portal button remains visible
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
        {/* Desktop navigation */}
        <Navigation className="max-1280:hidden" />

        {/* Mobile toggle — inline when closed, portaled above panel when open */}
        {!panelVisible && (
          <button
            className="1280:hidden cursor-pointer size-11 rounded-full bg-ci-dark flex items-center justify-center"
            onClick={() => {
              setMenuOpen(true);
              setPanelVisible(true);
            }}
            aria-expanded={false}
            aria-label="Menü einblenden"
          >
            <Ellipsis aria-hidden="true" className="size-4.5 text-ci-light" />
          </button>
        )}

        {/* Placeholder keeps grid space when button is portaled */}
        {panelVisible && (
          <div className="1280:hidden size-11" aria-hidden="true" />
        )}
      </div>

      {/* Mobile toggle portal — active while panel is visible (incl. exit animation) */}
      {panelVisible &&
        createPortal(
          <button
            className="1280:hidden cursor-pointer fixed top-8 right-8 size-11 z-210 rounded-full bg-ci-dark flex items-center justify-center"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Menü ausblenden" : "Menü einblenden"}
          >
            <motion.span
              aria-hidden="true"
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="flex items-center justify-center"
            >
              <Ellipsis className="size-4.5 text-ci-light" />
            </motion.span>
          </button>,
          document.body,
        )}

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onExitComplete={() => setPanelVisible(false)}
      />
    </header>
  );
}
