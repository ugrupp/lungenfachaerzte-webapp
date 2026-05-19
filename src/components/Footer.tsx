import Contact from "#/components/Contact";
import { Image } from "#/components/Image";
import { isContactPagePath } from "#/lib/contact";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import { getGlobalsServerFn } from "#/serverFunctions/getGlobalsServerFn";
import Info from "#/svg/info-2.svg?react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";

const scrollReveal = createScrollRevealVariants();

export default function Footer() {
  const {
    data: { footer, textur },
  } = useSuspenseQuery({
    queryKey: ["globals"],
    queryFn: () => getGlobalsServerFn(),
  });

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isContactPage = isContactPagePath(pathname);

  return (
    <>
      {!isContactPage && textur && (
        <div className="h-107 768:h-112 -mb-10 768:-mb-12.5">
          <Image
            src={textur.url}
            srcSet={textur.srcset}
            sizes="100vw"
            alt=""
            focalPoint={textur.focalPoint}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {!isContactPage && <Contact />}

      <motion.footer
        className="bg-ci-light relative z-70 pb-14 768:pb-24"
        {...scrollReveal.containerProps}
      >
        {/* Infotext 1 */}
        <div className="768:absolute top-0 inset-x-0 container-grid pointer-events-none">
          <div className="row-start-1 bg-white col-[content/full] 768:col-[full/10] 1024:col-end-7"></div>
          <motion.div
            className="row-start-1 col-[content/content] ml-(--logo-offset) 768:col-[content/10] 1024:col-end-7 py-11 768:py-14 768:pr-13 1280:pr-15 relative pointer-events-auto"
            variants={scrollReveal.itemVariants}
          >
            <Info className="text-ci-light absolute left-0 top-0 -translate-y-1/2 size-11" />
            {!!footer.infoText1?.__html && (
              <div
                className="richtext leading-relaxed"
                dangerouslySetInnerHTML={footer.infoText1}
              />
            )}
          </motion.div>
        </div>

        <div className="container-grid items-end pt-14 768:pt-24">
          {/* Infotext 2 */}
          <motion.div
            id="weitere-informationen-zur-terminbuchung"
            className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 row-start-1"
            variants={scrollReveal.itemVariants}
          >
            {!!footer.infoText2?.__html && (
              <div
                className="richtext leading-snug"
                dangerouslySetInnerHTML={footer.infoText2}
              />
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] max-1024:ml-(--logo-offset) mt-14 768:mt-0 768:row-start-1 flex flex-col items-start gap-y-3"
            variants={scrollReveal.itemVariants}
          >
            {footer.navigationItems.map(({ id, link }) => (
              <a
                key={id}
                href={link.href}
                target={link.target}
                rel={
                  link.target === "_blank" ? "noopener noreferrer" : undefined
                }
                className="inline-block font-bold text-14 tracking-wide leading-relaxed uppercase underline underline-offset-5"
              >
                {link.label ?? link.defaultLabel}
              </a>
            ))}
          </motion.div>
        </div>
      </motion.footer>
    </>
  );
}
