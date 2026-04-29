import CraftLink from "#/components/CraftLink";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Doctors from "#/svg/doctors.svg?react";
import Logo from "#/svg/logo.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
    staleTime: 1000 * 60 * 60,
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
        <Link to="/" className="block ml-(--logo-offset) h-[95.37px] w-fit">
          <Logo className="h-full w-auto" />
          <span className="sr-only">Zur Startseite</span>
        </Link>

        <Doctors />
      </div>

      {/* Appointment */}
      <div className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 mt-23 768:mt-39.75 flex flex-col items-start">
        {!!contact.appointmentText && (
          <div className="richtext richtext--on-dark text-18 leading-snug">
            {parse(contact.appointmentText)}
          </div>
        )}

        {contact.appointmentLink && (
          <CraftLink
            link={contact.appointmentLink}
            className="mt-5 inline-block font-bold text-14 tracking-wide leading-relaxed uppercase underline underline-offset-5"
          >
            {contact.appointmentLink.label ??
              contact.appointmentLink.defaultLabel}
          </CraftLink>
        )}

        {doctolibLink && (
          <Button
            label={doctolibLink.label ?? doctolibLink.defaultLabel}
            link={doctolibLink}
            variant="on-ci"
            className="inline-block mt-7"
          />
        )}
      </div>

      {/* Contact */}
      <div className="col-[content/content] max-1024:ml-(--logo-offset) 768:col-[content/11] 1024:col-[7/12] mt-23 768:mt-15">
        {!!contact.contactText && (
          <div>
            <ContactSectionHeading>Kontakt</ContactSectionHeading>

            <div className="mt-6 richtext richtext--on-dark text-18 leading-snug">
              {parse(contact.contactText)}
            </div>
          </div>
        )}

        {!!contact.opentimes && (
          <div className="mt-14">
            <ContactSectionHeading>Sprechzeiten</ContactSectionHeading>
            <div className="mt-6 richtext richtext--on-dark text-18 leading-snug">
              {parse(contact.opentimes)}
            </div>
          </div>
        )}

        {(!!contact.address || contact.routeLink) && (
          <div className="mt-14">
            <ContactSectionHeading>Adresse</ContactSectionHeading>
            {!!contact.address && (
              <div className="mt-6 richtext richtext--on-dark text-18 leading-snug">
                {parse(contact.address)}
              </div>
            )}

            {contact.routeLink && (
              <Button
                label={
                  contact.routeLink.label ?? contact.routeLink.defaultLabel
                }
                link={contact.routeLink}
                variant="on-ci"
                className="mt-6"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
