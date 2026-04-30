import { Image } from "#/components/Image";
import { makeCraftLink } from "#/lib/craftLink";
import type { HomeTeaser } from "#/queries/home";
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

type HomeTeasersProps = ComponentPropsWithoutRef<"section">;

export function HomeTeasers({ className, ...props }: HomeTeasersProps) {
  const { teaserSchwerpunkte, teaserAusstattung } = routeApi.useLoaderData();

  return (
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
  );
}
