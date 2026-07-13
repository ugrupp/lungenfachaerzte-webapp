import { Image } from "#/components/Image";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import type { HomeTeamTeaser, HomeTeaser } from "#/queries/home";
import { getRouteApi } from "@tanstack/react-router";
import clsx from "clsx";
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import Button from "./Button";

const routeApi = getRouteApi("/");
const scrollReveal = createScrollRevealVariants();

type TeaserProps = {
  teaser: HomeTeaser;
  className?: string;
};

function Teaser({ teaser, className }: TeaserProps) {
  return (
    <motion.div
      className={clsx("container-grid grid-flow-dense", className)}
      {...scrollReveal.containerProps}
    >
      {/* Headline */}
      <motion.div
        className="col-[content/content] 1024:col-end-12 ml-(--logo-offset)"
        variants={scrollReveal.itemVariants}
      >
        <h2 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full overflow-hidden">
          <a className="px-7 py-2.75 block" href={teaser.url}>
            {teaser.headline || teaser.title}
          </a>
        </h2>
      </motion.div>

      {/* Text */}
      {!!teaser.introText?.__html && (
        <motion.div
          className="col-[content/content] 768:col-end-10 768:ml-(--logo-offset) 1024:ml-0 1024:col-[7/12] mt-8 richtext text-18"
          variants={scrollReveal.itemVariants}
          dangerouslySetInnerHTML={teaser.introText}
        />
      )}

      {/* Link button */}
      <motion.div
        className="col-[content/content] max-1024:ml-(--logo-offset) 768:col-end-10 1024:col-[7/12] mt-14 768:mt-32 1024:mt-12 768:self-end"
        variants={scrollReveal.itemVariants}
      >
        <Button href={teaser.url} aria-label={teaser.title}>
          Mehr erfahren
        </Button>
      </motion.div>

      {/* Image */}
      {teaser.teaserImage && (
        <motion.div
          className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 768:row-span-2 1024:row-span-3 mt-10 768:mt-8 1024:mt-0 relative"
          variants={scrollReveal.itemVariants}
        >
          <a
            href={teaser.url}
            className="block w-full h-81.25 768:h-full 768:absolute 768:inset-0 rounded-br-[40px] 768:rounded-br-[50px] overflow-hidden"
            aria-label={teaser.title}
          >
            <Image
              src={teaser.teaserImage.url}
              srcSet={teaser.teaserImage.srcset}
              alt={teaser.teaserImage.alt ?? ""}
              sizes="100vw"
              focalPoint={teaser.teaserImage.focalPoint}
              className="size-full object-cover"
            />
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

type TeamTeaserProps = {
  teaser: HomeTeamTeaser;
  className?: string;
};

function TeamTeaser({ teaser, className }: TeamTeaserProps) {
  return (
    <motion.div
      className={clsx("container-grid", className)}
      {...scrollReveal.containerProps}
    >
      {/* Image */}
      {teaser.teaserImage && (
        <div className="col-[full/full] 768:col-end-[center] h-95 768:h-auto relative bg-ci-dark row-start-4 768:row-start-1 row-span-3 overflow-hidden">
          <a
            href={teaser.url}
            className="absolute size-full"
            aria-label={teaser.title}
          >
            <Image
              src={teaser.teaserImage.url}
              srcSet={teaser.teaserImage.srcset}
              alt={teaser.teaserImage.alt ?? ""}
              sizes="100vw"
              focalPoint={teaser.teaserImage.focalPoint}
              className="size-full object-cover"
            />
          </a>
        </div>
      )}

      {/* Content bg */}
      <div className="col-[full/full] 768:col-start-[center] bg-ci-light row-start-1 row-span-3"></div>
      {/* Headline */}
      <motion.div
        className="col-[content/content] 768:col-start-11 1024:col-start-13 max-768:ml-(--logo-offset) bg-ci-light row-start-1 pt-25"
        variants={scrollReveal.itemVariants}
      >
        <h2 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full overflow-hidden">
          <a className="px-7 py-2.75 block" href={teaser.url}>
            {teaser.title}
          </a>
        </h2>
      </motion.div>

      {/* Text */}
      {!!teaser.teaserText?.__html && (
        <motion.div
          className="col-[content/content] 768:col-start-11 1024:col-start-13 mt-8 richtext text-18 row-start-2"
          variants={scrollReveal.itemVariants}
          dangerouslySetInnerHTML={teaser.teaserText}
        />
      )}

      {/* Link button */}
      <motion.div
        className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 mt-14 768:mt-18 pb-25 row-start-3"
        variants={scrollReveal.itemVariants}
      >
        <Button href={teaser.url} variant="on-ci-light">
          Mehr erfahren
        </Button>
      </motion.div>
    </motion.div>
  );
}

type HomeTeasersProps = ComponentPropsWithoutRef<"section">;

export function HomeTeasers({ className, ...props }: HomeTeasersProps) {
  const { teaserSchwerpunkte, teaserAusstattung, teaserTeam } =
    routeApi.useLoaderData();

  return (
    <>
      <section
        className={clsx("bg-off-white py-30 768:py-44 1024:py-50", className)}
        {...props}
      >
        <Teaser teaser={teaserSchwerpunkte} />
        <Teaser
          teaser={teaserAusstattung}
          className="mt-30 768:mt-44 1024:mt-50"
        />
      </section>
      <section>
        <TeamTeaser teaser={teaserTeam} />
      </section>
    </>
  );
}
