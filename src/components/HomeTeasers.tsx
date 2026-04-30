import { Image } from "#/components/Image";
import { makeCraftLink } from "#/lib/craftLink";
import type { HomeTeamTeaser, HomeTeaser } from "#/queries/home";
import { getRouteApi } from "@tanstack/react-router";
import clsx from "clsx";
import parse from "html-react-parser";
import type { ComponentPropsWithoutRef } from "react";
import Button from "./Button";

const routeApi = getRouteApi("/");

type TeaserProps = { teaser: HomeTeaser } & ComponentPropsWithoutRef<"div">;

function Teaser({ teaser, className, ...props }: TeaserProps) {
  return (
    <div
      className={clsx("container-grid grid-flow-dense", className)}
      {...props}
    >
      {/* Headline */}
      <div className="col-[content/content] 1024:col-end-12 ml-(--logo-offset)">
        <h2 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full overflow-hidden">
          <a className="px-7 py-2.75 block" href={teaser.url}>
            {teaser.title}
          </a>
        </h2>
      </div>

      {/* Text */}
      {!!teaser.introText?.html && (
        <div className="col-[content/content] 768:col-end-10 768:ml-(--logo-offset) 1024:ml-0 1024:col-[7/12] mt-8 richtext text-18">
          {parse(teaser.introText.html)}
        </div>
      )}

      {/* Link button */}
      <div className="col-[content/content] max-1024:ml-(--logo-offset) 768:col-end-10 1024:col-[7/12] mt-14 768:mt-32 1024:mt-12 768:self-end">
        <Button link={makeCraftLink(teaser.url)} label="Mehr erfahren" />
      </div>

      {/* Image */}
      {teaser.mainImage && (
        <div className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 768:row-span-2 1024:row-span-3 mt-10 768:mt-8 1024:mt-0">
          <a
            href={teaser.url}
            className="block w-full h-81.25 768:h-full rounded-br-[40px] 768:rounded-br-[50px] overflow-hidden"
          >
            <Image
              src={teaser.mainImage.url}
              srcSet={teaser.mainImage.srcset}
              alt={teaser.mainImage.alt ?? ""}
              sizes="100vw"
              focalPoint={teaser.mainImage.focalPoint}
              className="size-full object-cover"
            />
          </a>
        </div>
      )}
    </div>
  );
}

type TeamTeaserProps = {
  teaser: HomeTeamTeaser;
} & ComponentPropsWithoutRef<"div">;

function TeamTeaser({ teaser, className, ...props }: TeamTeaserProps) {
  return (
    <div className={clsx("container-grid", className)} {...props}>
      {/* Image bg */}
      <div className="col-[full/full] 768:col-end-[center] bg-ci-dark row-start-4 768:row-start-1 row-span-3"></div>
      {/* Image */}
      <div className="col-[full/full] 768:col-end-[center] h-95 768:h-auto row-start-4 768:row-start-1 row-span-3"></div>

      {/* Content bg */}
      <div className="col-[full/full] 768:col-start-[center] bg-ci-light row-start-1 row-span-3"></div>
      {/* Headline */}
      <div className="col-[content/content] 768:col-start-11 1024:col-start-13 max-768:ml-(--logo-offset) bg-ci-light row-start-1 pt-25">
        <h2 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full overflow-hidden">
          <a className="px-7 py-2.75 block" href={teaser.url}>
            {teaser.title}
          </a>
        </h2>
      </div>

      {/* Text */}
      {!!teaser.teaserText?.html && (
        <div className="col-[content/content] 768:col-start-11 1024:col-start-13 mt-8 richtext text-18 row-start-2">
          {parse(teaser.teaserText.html)}
        </div>
      )}

      {/* Link button */}
      <div className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 mt-14 768:mt-18 pb-25 row-start-3">
        <Button
          link={makeCraftLink(teaser.url)}
          label="Mehr erfahren"
          variant="on-ci-light"
        />
      </div>
    </div>
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
