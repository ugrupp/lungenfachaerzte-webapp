import { useMobileMenu } from "#/lib/useMobileMenu";
import Ellipsis from "#/svg/ellipsis.svg?react";
import clsx from "clsx";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import MobileMenu from "./MobileMenu";

type Props = {
  inverted?: boolean;
};

/**
 * Renders the mobile menu toggle (inline button + placeholder), the portaled
 * floating close/open button, and the MobileMenu panel. Handles all state
 * internally. Use `inverted` on dark backgrounds (contact, 404).
 */
export default function MobileMenuToggle({ inverted = false }: Props) {
  const { menuOpen, setMenuOpen, panelVisible, setPanelVisible } =
    useMobileMenu();

  return (
    <>
      {/* Inline button — visible when panel is not yet open */}
      {!panelVisible ? (
        <button
          className={clsx(
            "1280:hidden cursor-pointer size-11 rounded-full flex items-center justify-center",
            inverted ? "bg-white" : "bg-ci-dark",
          )}
          onClick={() => {
            setPanelVisible(true);
            requestAnimationFrame(() => setMenuOpen(true));
          }}
          aria-expanded={false}
          aria-label="Menü einblenden"
        >
          <Ellipsis
            aria-hidden="true"
            className={clsx(
              "size-4.5",
              inverted ? "text-ci-dark" : "text-ci-light",
            )}
          />
        </button>
      ) : (
        <>
          {/* Placeholder — keeps grid space while button is portaled */}
          <div className="1280:hidden size-11" aria-hidden="true" />

          {/* Portal button — active while panel is visible (incl. exit animation) */}
          {createPortal(
            <button
              className={clsx(
                "1280:hidden cursor-pointer fixed top-8 right-8 size-11 z-210 rounded-full flex items-center justify-center",
                inverted
                  ? clsx(
                      "transition-colors duration-250",
                      menuOpen ? "bg-ci-dark" : "bg-white",
                    )
                  : "bg-ci-dark",
              )}
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
                <Ellipsis
                  className={clsx(
                    "size-4.5",
                    inverted
                      ? clsx(
                          "transition-colors duration-250",
                          menuOpen ? "text-ci-light" : "text-ci-dark",
                        )
                      : "text-ci-light",
                  )}
                />
              </motion.span>
            </button>,
            document.body,
          )}
        </>
      )}

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onExitComplete={() => setPanelVisible(false)}
      />
    </>
  );
}
