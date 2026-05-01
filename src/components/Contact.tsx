import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Doctors from "#/svg/doctors.svg?react";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import clsx from "clsx";
import parse from "html-react-parser";
import { type ComponentPropsWithoutRef } from "react";
import Button from "./Button";

function ContactSectionHeading({ children }: { children: string }) {
  return (
    <h3 className="text-16 leading-snug tracking-wide text-ci-dark bg-ci-light uppercase pt-1.25 pb-0.75 px-4 rounded-full inline-block">
      {children}
    </h3>
  );
}

type ContactProps = ComponentPropsWithoutRef<"section">;

export default function Contact({ className, ...props }: ContactProps) {
  const {
    data: { contact, doctolibLink },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
  });

  return (
    <section
      className={clsx(
        "relative top-0 z-60 bg-ci-dark text-ci-light rounded-tr-[40px] 768:rounded-tr-[50px] pb-30 container-grid items-start",
        className,
      )}
      {...props}
    >
      {/* Logo */}
      <div className="1024:sticky top-0 bottom-0 pt-8 1024:pb-8 col-start-[content] flex flex-col items-start gap-y-8">
        <a href="/" className="block ml-(--logo-offset) h-[95.37px] w-fit">
          <Logo className="h-full w-auto" />
          <span className="sr-only">Zur Startseite</span>
        </a>

        <Doctors />
      </div>

      {/* Appointment */}
      <div className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 mt-23 768:mt-39.75 flex flex-col items-start">
        {!!contact?.appointmentText?.html && (
          <div className="richtext richtext--on-dark text-18 leading-snug">
            {parse(contact.appointmentText.html)}
          </div>
        )}

        {contact?.appointmentLink && (
          <a
            href={contact.appointmentLink.href}
            target={contact.appointmentLink.target}
            rel={
              contact.appointmentLink.target === "_blank"
                ? "noopener noreferrer"
                : undefined
            }
            className="mt-5 inline-block font-bold text-14 tracking-wide leading-relaxed uppercase underline underline-offset-5"
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
      </div>

      {/* Contact */}
      <div className="col-[content/content] max-1024:ml-(--logo-offset) 768:col-[content/11] 1024:col-[7/12] mt-23 768:mt-15">
        {!!contact?.contactText?.html && (
          <div>
            <ContactSectionHeading>Kontakt</ContactSectionHeading>

            <div className="mt-6 richtext richtext--on-dark text-18 leading-snug">
              {parse(contact.contactText.html)}
            </div>
          </div>
        )}

        {!!contact?.opentimes?.html && (
          <div className="mt-14">
            <ContactSectionHeading>Sprechzeiten</ContactSectionHeading>
            <div className="mt-6 richtext richtext--on-dark text-18 leading-snug">
              {parse(contact.opentimes.html)}
            </div>
          </div>
        )}

        {(!!contact?.address?.html || contact?.routeLink) && (
          <div className="mt-14">
            <ContactSectionHeading>Adresse</ContactSectionHeading>
            {!!contact.address?.html && (
              <div className="mt-6 richtext richtext--on-dark text-18 leading-snug">
                {parse(contact.address.html)}
              </div>
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
      </div>
    </section>
  );
}
