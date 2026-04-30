import Contact from "#/components/Contact";
import CraftLink from "#/components/CraftLink";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Info from "#/svg/info-2.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import parse from "html-react-parser";

export default function Footer() {
  const {
    data: { footer },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <>
      <Contact />

      <footer className="bg-ci-light relative z-70 pb-14 768:pb-24">
        {/* Infotext 1 */}
        <div className="768:absolute top-0 inset-x-0 container-grid pointer-events-none">
          <div className="row-start-1 bg-white col-[content/full] 768:col-[full/10] 1024:col-end-7"></div>
          <div className="row-start-1 col-[content/content] ml-(--logo-offset) 768:col-[content/10] 1024:col-end-7 py-11 768:py-14 768:pr-13 1280:pr-15 relative pointer-events-auto">
            <Info className="text-ci-light absolute left-0 top-0 -translate-y-1/2 size-11" />
            {!!footer.infoText1?.html && (
              <div className="richtext leading-relaxed">
                {parse(footer.infoText1.html)}
              </div>
            )}
          </div>
        </div>

        <div className="container-grid items-end pt-14 768:pt-24">
          {/* Infotext 2 */}
          <div className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 row-start-1">
            {!!footer.infoText2?.html && (
              <div className="richtext leading-snug">
                {parse(footer.infoText2.html)}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] max-1024:ml-(--logo-offset) mt-14 768:mt-0 768:row-start-1 flex flex-col items-start gap-y-3">
            {footer.navigationItems.map(({ id, link }) => (
              <CraftLink
                key={id}
                link={link}
                className="inline-block font-bold text-14 tracking-wide leading-relaxed uppercase underline underline-offset-5"
              >
                {link.label ?? link.defaultLabel}
              </CraftLink>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
