import { createScrollRevealVariants } from "#/lib/scrollReveal";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Doctors from "#/svg/doctors.svg?react";
import Ellipsis from "#/svg/ellipsis.svg?react";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import Navigation from "./Navigation";

function ContactSectionHeading({ children }: { children: string }) {
  return (
    <h3 className="text-16 leading-snug tracking-wide text-ci-dark bg-ci-light uppercase pt-1.25 pb-0.75 px-4 rounded-full inline-block">
      {children}
    </h3>
  );
}

type ContactProps = Omit<
  ComponentPropsWithoutRef<"section">,
  "onDrag" | "onDragStart" | "onDragEnd"
> & {
  standalone?: boolean;
};

const scrollReveal = createScrollRevealVariants();

export default function Contact({
  className,
  standalone = false,
}: ContactProps) {
  const {
    data: { contact, doctolibLink },
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
      if (e.matches) {
        setMenuOpen(false);
        setPanelVisible(false);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <motion.section
      className={clsx(
        "relative top-0 z-60 bg-ci-dark text-ci-light pb-30 container-grid items-start",
        !standalone && "rounded-tr-[40px] 768:rounded-tr-[50px]",
        className,
      )}
      {...scrollReveal.containerProps}
    >
      {/* Navigation */}
      {standalone && (
        <>
          {/* Desktop navigation */}
          <div
            className="col-end-[content-end] w-fit justify-self-end sticky top-0 bottom-0 z-50 pt-8 row-start-1"
            id="navigation"
          >
            <Navigation onCiDark className="max-1280:hidden" />

            {/* Mobile toggle — inline when closed, portaled above panel when open */}
            {!panelVisible && (
              <button
                className="1280:hidden cursor-pointer size-11 rounded-full bg-white flex items-center justify-center"
                onClick={() => {
                  setPanelVisible(true);
                  requestAnimationFrame(() => setMenuOpen(true));
                }}
                aria-expanded={false}
                aria-label="Menü einblenden"
              >
                <Ellipsis
                  aria-hidden="true"
                  className="size-4.5 text-ci-dark"
                />
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
                className={clsx(
                  "1280:hidden cursor-pointer fixed top-8 right-8 size-11 z-210 rounded-full flex items-center justify-center transition-colors duration-250",
                  menuOpen ? "bg-ci-dark" : "bg-white",
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
                      "size-4.5 transition-colors duration-250",
                      menuOpen ? "text-ci-light" : "text-ci-dark",
                    )}
                  />
                </motion.span>
              </button>,
              document.body,
            )}

          <MobileMenu
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            onExitComplete={() => setPanelVisible(false)}
          />
        </>
      )}

      {/* Logo */}
      <div className="1024:sticky top-0 bottom-0 pt-8 col-start-[content] flex flex-col items-start gap-y-8 row-start-1">
        <a href="/" className="block ml-(--logo-offset) h-[95.37px] w-fit">
          <Logo className="h-full w-auto" />
          <span className="sr-only">Zur Startseite</span>
        </a>

        <Doctors />
      </div>

      {/* Appointment */}
      <motion.div
        className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 mt-23 768:mt-39.75 flex flex-col items-start row-start-2 768:row-start-1"
        variants={scrollReveal.itemVariants}
      >
        {!!contact.appointmentText?.__html && (
          <div
            className="richtext richtext--on-ci-dark text-18 leading-snug"
            dangerouslySetInnerHTML={contact.appointmentText}
          />
        )}

        {contact.appointmentLink && (
          <a
            href={contact.appointmentLink.href}
            target={contact.appointmentLink.target}
            rel={
              contact.appointmentLink.target === "_blank"
                ? "noopener noreferrer"
                : undefined
            }
            className="mt-5 inline-block font-bold text-14 tracking-wide leading-relaxed uppercase underline underline-offset-5 hover:text-white transition-colors duration-250"
          >
            {contact.appointmentLink.label ??
              contact.appointmentLink.defaultLabel}
          </a>
        )}

        {doctolibLink && (
          <Button
            href={doctolibLink.href}
            target={doctolibLink.target}
            rel={
              doctolibLink.target === "_blank"
                ? "noopener noreferrer"
                : undefined
            }
            variant="on-ci"
            className="inline-block mt-7"
          >
            {doctolibLink.label ?? doctolibLink.defaultLabel}
          </Button>
        )}
      </motion.div>

      {/* Contact */}
      <motion.div
        className="col-[content/content] max-1024:ml-(--logo-offset) 768:col-[content/11] 1024:col-[7/12] mt-23 768:mt-15 row-start-3 768:row-start-2"
        variants={scrollReveal.itemVariants}
      >
        {!!contact.contactText?.__html && (
          <div>
            <ContactSectionHeading>Kontakt</ContactSectionHeading>

            <div
              className="mt-6 richtext richtext--on-ci-dark text-18 leading-snug"
              dangerouslySetInnerHTML={contact.contactText}
            />
          </div>
        )}

        {!!contact.opentimes?.__html && (
          <div className="mt-14">
            <ContactSectionHeading>Sprechzeiten</ContactSectionHeading>
            <div
              className="mt-6 richtext richtext--on-ci-dark text-18 leading-snug"
              dangerouslySetInnerHTML={contact.opentimes}
            />
          </div>
        )}

        {(!!contact.address?.__html || contact.routeLink) && (
          <div className="mt-14">
            <ContactSectionHeading>Adresse</ContactSectionHeading>
            {!!contact.address?.__html && (
              <div
                className="mt-6 richtext richtext--on-ci-dark text-18 leading-snug"
                dangerouslySetInnerHTML={contact.address}
              />
            )}

            {contact.routeLink && (
              <Button
                href={contact.routeLink.href}
                target={contact.routeLink.target}
                rel={
                  contact.routeLink.target === "_blank"
                    ? "noopener noreferrer"
                    : undefined
                }
                variant="on-ci"
                className="mt-6"
              >
                {contact.routeLink.label ?? contact.routeLink.defaultLabel}
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
