import Button from "#/components/Button";
import CraftLink from "#/components/CraftLink";
import { Image } from "#/components/Image";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

export default function MobileMenu({ isOpen, onClose, onExitComplete }: Props) {
  const {
    data: { navigation: navItems, doctolibLink, textur },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  // Track scroll container's natural content height for texture positioning
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContentHeight(el.offsetHeight));
    ro.observe(el);
    setContentHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Focus panel on open
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <>
          {/* Invisible backdrop — catches clicks outside the panel */}
          <div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 z-199"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed top-0 right-0 bottom-0 z-200 w-[min(calc(100%-59px),348px)] bg-off-white flex flex-col focus:outline-none"
          >
            {/* Scrollable content — starts 80px below toggle bottom (top-8 + size-11 + 83px = 159px) */}
            <div ref={scrollRef} className="overflow-y-auto pt-39.75 pb-22">
              {/* Nav items */}
              <nav className="flex flex-col px-11 gap-y-5">
                {navItems.map(({ id, link }) => (
                  <CraftLink
                    key={id}
                    link={link}
                    onClick={onClose}
                    className="text-24 leading-none tracking-wide text-ci-dark uppercase w-fit"
                  >
                    {link.label ?? link.defaultLabel}
                  </CraftLink>
                ))}
              </nav>
              {/* Doctolib button — 80px below nav */}
              {doctolibLink && (
                <div className="px-11 mt-20">
                  <Button
                    label={doctolibLink.label ?? doctolibLink.defaultLabel}
                    link={doctolibLink}
                    onClick={onClose}
                  />
                </div>
              )}
            </div>

            {/* Decorative texture — outside flow, below natural content height, not scrollable */}
            {textur && contentHeight !== null && (
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden"
                style={{ top: contentHeight }}
              >
                <Image
                  src={textur.url}
                  srcSet={textur.srcset}
                  sizes="348px"
                  alt=""
                  focalPoint={textur.focalPoint}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
