import { createScrollRevealVariants } from "#/lib/scrollReveal";
import ArrowLongDown from "#/svg/arrow-long-down.svg?react";
import Info from "#/svg/info-1.svg?react";
import { getRouteApi } from "@tanstack/react-router";
import { motion } from "motion/react";

const routeApi = getRouteApi("/");
const scrollReveal = createScrollRevealVariants();

export function HomeIntro() {
  const { introHead, introText, introInfotext } = routeApi.useLoaderData();

  return (
    <motion.section
      id="start"
      className="bg-ci-light pt-22 768:pt-33 container-grid relative"
      {...scrollReveal.containerProps}
    >
      {/* Scroll indicator */}
      <div className="absolute top-0 left-0 right-0 hidden 1024:block">
        <div className="container-grid">
          <div className="col-[content/content] ml-(--logo-offset) flex justify-start pointer-events-none">
            <a
              href="#start"
              className="block relative h-16 pointer-events-auto -translate-x-1/2 -translate-y-1/2"
            >
              <ArrowLongDown className="h-full w-auto text-ci-light [clip-path:inset(0_0_50%_0)]" />
              <ArrowLongDown className="h-full w-auto absolute inset-0 text-white [clip-path:inset(50%_0_0_0)]" />
              <div className="sr-only">Zum Content springen</div>
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="row-start-1 col-[content/content] max-1024:ml-(--logo-offset) 768:col-end-10 768:mb-40 1024:col-[7/12] 1024:mb-0"
        variants={scrollReveal.itemVariants}
      >
        {!!introHead?.__html && (
          <div className="richtext" dangerouslySetInnerHTML={introHead} />
        )}
      </motion.div>

      <motion.div
        className="row-start-2 768:row-start-1 col-[content/content] 768:col-start-11 mt-20 768:mt-30 1024:col-start-13"
        variants={scrollReveal.itemVariants}
      >
        {!!introText?.__html && (
          <div className="richtext" dangerouslySetInnerHTML={introText} />
        )}
      </motion.div>

      <div className="bg-white row-start-3 768:row-start-2 col-[content/full] 768:col-[full/10] 1024:col-end-7 mt-20 768:-mt-20 1024:-mt-26"></div>
      <motion.div
        className="row-start-3 768:row-start-2 col-[content/content] ml-(--logo-offset) 768:col-[content/10] 1024:col-end-7 mt-20 768:-mt-20 1024:-mt-26 768:pr-13 1280:pr-15 py-14 relative"
        variants={scrollReveal.itemVariants}
      >
        <Info className="absolute left-0 top-0 -translate-y-1/2 size-11" />
        {!!introInfotext?.__html && (
          <div
            className="richtext leading-relaxed"
            dangerouslySetInnerHTML={introInfotext}
          />
        )}
      </motion.div>
    </motion.section>
  );
}
