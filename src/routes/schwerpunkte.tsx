import SubHeader from "#/components/SubHeader";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import { seoToHead } from "#/lib/seo";
import type { Text } from "#/lib/text";
import { getSchwerpunktePageServerFn } from "#/serverFunctions/getSchwerpunktePageServerFn";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { kebabCase } from "es-toolkit";
import { motion } from "motion/react";

const scrollReveal = createScrollRevealVariants();

export const Route = createFileRoute("/schwerpunkte")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getSchwerpunktePageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo, loaderData?.uri),
  component: SchwerpunktePage,
});

type ContentTextProps = {
  text?: Text;
  className?: string;
};

function ContentText({ text, className }: ContentTextProps) {
  if (!text?.__html) return null;

  return (
    <motion.div
      className={clsx("richtext text-18 leading-snug", className)}
      variants={scrollReveal.itemVariants}
      dangerouslySetInnerHTML={text}
    />
  );
}

function addHeadline2ClassToH3(text?: Text): Text | undefined {
  if (!text?.__html) return text;

  const openingH3TagPattern = /<h3(\s[^>]*)?>/gi;
  const classAttributePattern = /class=("|')(.*?)\1/i;
  const replaceOpeningH3 = (_match: string, rawAttributes = ""): string => {
    const attributes = rawAttributes;
    const classMatch = classAttributePattern.exec(attributes);

    if (!classMatch) {
      return `<h3${attributes} class="headline--h2">`;
    }

    const quote = classMatch[1];
    const classNames = classMatch[2].split(/\s+/).filter(Boolean);

    if (!classNames.includes("headline--h2")) {
      classNames.push("headline--h2");
    }

    return `<h3${attributes.replace(
      classAttributePattern,
      `class=${quote}${classNames.join(" ")}${quote}`,
    )}>`;
  };

  return {
    __html: text.__html.replaceAll(openingH3TagPattern, replaceOpeningH3),
  };
}

function SchwerpunktePage() {
  const {
    title,
    heroImage,
    headline,
    introText,
    text,
    text2,
    text3,
    headline2,
    introText2,
    text4,
  } = Route.useLoaderData();
  const transformedText4 = addHeadline2ClassToH3(text4);

  return (
    <>
      <SubHeader heroImage={heroImage} />

      <div className="bg-off-white py-30 768:py-38 1024:pb-50">
        {/* Schwerpunkte */}
        <motion.section
          className="container-grid gap-y-8 768:gap-y-0 1024:gap-y-16"
          {...scrollReveal.containerProps}
        >
          {/* Headline */}
          <motion.div
            className="col-[content/content] ml-(--logo-offset)"
            variants={scrollReveal.itemVariants}
          >
            <h1 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full px-7 py-2.75 overflow-hidden">
              {headline || title}
            </h1>
          </motion.div>

          {/* Text */}
          {!!introText?.__html && (
            <motion.div
              className="col-[content/content] 768:col-start-11 1024:col-start-13 richtext text-18"
              variants={scrollReveal.itemVariants}
            >
              <div className="richtext" dangerouslySetInnerHTML={introText} />
            </motion.div>
          )}
        </motion.section>

        {/* Content */}
        <motion.section
          className="mt-18 768:mt-36 container-grid grid-flow-dense"
          {...scrollReveal.containerProps}
        >
          <ContentText
            text={text}
            className="col-[content/content] 768:col-[content/10] 1280:col-[content/6] ml-(--logo-offset) 1280:self-end"
          />
          <ContentText
            text={text2}
            className="col-[content/content] 768:col-start-11 1280:col-[7/12] mt-14 768:mt-0"
          />
          <ContentText
            text={text3}
            className="col-[content/content] 768:col-[7/13] 1280:col-[13/content] mx-(--logo-offset) 768:mx-0 mt-14 1280:mt-0"
          />
        </motion.section>

        {/* Ausstattung */}
        <motion.section
          className="mt-30 768:mt-44 1024:mt-50 container-grid gap-y-8 768:gap-y-0 1024:gap-y-16"
          id={kebabCase(headline2 || "") || undefined}
          {...scrollReveal.containerProps}
        >
          {/* Headline */}
          <motion.div
            className="col-[content/content] ml-(--logo-offset) 768:grid-row-1"
            variants={scrollReveal.itemVariants}
          >
            <h2 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full px-7 py-2.75 overflow-hidden">
              {headline2}
            </h2>
          </motion.div>

          {/* Text */}
          {!!introText2?.__html && (
            <motion.div
              className="col-[content/content] 768:col-start-11 1024:col-start-13 768:grid-row-2 richtext text-18"
              variants={scrollReveal.itemVariants}
            >
              <div className="richtext" dangerouslySetInnerHTML={introText2} />
            </motion.div>
          )}
        </motion.section>

        {/* Content */}
        {transformedText4?.__html && (
          <motion.section
            className="mt-18 768:mt-36 container-grid"
            {...scrollReveal.containerProps}
          >
            <ContentText
              text={transformedText4}
              className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] ml-(--logo-offset) 1024:ml-0"
            />
          </motion.section>
        )}
      </div>
    </>
  );
}
