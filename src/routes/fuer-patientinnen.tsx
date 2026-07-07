import SubHeader from "#/components/SubHeader";
import { craftPreviewSearchSchema } from "#/lib/craftPreview";
import { routeCacheHeaders } from "#/lib/routeCacheHeaders";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import { seoToHead } from "#/lib/seo";
import { getInfosPageServerFn } from "#/serverFunctions/getInfosPageServerFn";
import Download from "#/svg/download.svg?react";
import Minus from "#/svg/minus.svg?react";
import Plus from "#/svg/plus.svg?react";
import * as Accordion from "@radix-ui/react-accordion";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const scrollReveal = createScrollRevealVariants();

export const Route = createFileRoute("/fuer-patientinnen")({
  validateSearch: craftPreviewSearchSchema,
  loaderDeps: ({ search }) => ({
    token: search.token,
    preview: search["x-craft-live-preview"],
  }),
  loader: async ({ deps }) => {
    const entry = await getInfosPageServerFn({
      data: { previewToken: deps.token },
    });
    return { ...entry, _isPreview: !!deps.token };
  },
  headers: ({ loaderData }) => routeCacheHeaders(!!loaderData?._isPreview),
  head: ({ loaderData }) => seoToHead(loaderData?.seo, loaderData?.uri),
  component: InfosPage,
});

function InfosPage() {
  const {
    heroImage,
    title,
    headline,
    infoAccordion = [],
    text,
    downloadsHeadline,
    downloads = [],
  } = Route.useLoaderData();

  const [openItem, setOpenItem] = useState<string>("");
  const textRowStart = infoAccordion.length * 2 + 2;
  const downloadsRowStart = textRowStart + (text ? 1 : 0);

  return (
    <>
      <SubHeader heroImage={heroImage} />

      <div className="bg-off-white py-30 768:py-38 1024:pb-50">
        <motion.section
          className="container-grid"
          {...scrollReveal.containerProps}
        >
          {/* Headline */}
          <motion.div
            className="col-[content/content] 768:col-end-10 1024:col-end-7 ml-(--logo-offset) max-w-72"
            style={{ gridRowStart: 1 }}
            variants={scrollReveal.itemVariants}
          >
            <h1 className="headline--1">{headline || title}</h1>
          </motion.div>

          {/* Info Accordion */}
          <Accordion.Root
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="contents"
          >
            {infoAccordion.map((item, index) => {
              const value = String(item.id);
              const isOpen = openItem === value;

              return (
                <Accordion.Item
                  key={item.id}
                  value={value}
                  className="contents"
                >
                  <Accordion.Header asChild>
                    <motion.div
                      className="col-[content/content] 768:col-end-10 1024:col-[7/12]"
                      style={{ gridRowStart: index * 2 + 2 }}
                      variants={scrollReveal.itemVariants}
                    >
                      <Accordion.Trigger className="mt-8 768:mt-14 flex w-full justify-between gap-x-4 text-start cursor-pointer group">
                        <h2 className="headline--2 normal-case!">
                          {item.title}
                        </h2>

                        <span
                          className={`flex shrink-0 items-center justify-center rounded-full size-7.5 transition-colors duration-250 ${
                            isOpen
                              ? "bg-ci-light"
                              : "bg-ci-dark group-hover:bg-ci-light"
                          }`}
                        >
                          {isOpen ? (
                            <Minus className="size-3.5 text-ci-dark transition-colors duration-250" />
                          ) : (
                            <Plus className="size-3.5 text-ci-light transition-colors duration-250 group-hover:text-ci-dark" />
                          )}
                        </span>
                      </Accordion.Trigger>
                    </motion.div>
                  </Accordion.Header>

                  <Accordion.Content forceMount className="contents">
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={value}
                          className="col-[content/content] 768:col-start-11 1024:col-start-13 ml-(--logo-offset) 768:ml-0"
                          style={{ gridRowStart: index * 2 + 3 }}
                          variants={scrollReveal.itemVariants}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        >
                          <div className="overflow-hidden pt-4">
                            <div
                              className="richtext text-18 richtext--link-colored"
                              dangerouslySetInnerHTML={item.text}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>

          {/* Text */}
          {!!text?.__html && (
            <motion.div
              className="mt-14 768:mt-32 col-[content/content] 768:col-start-11 1024:col-start-13 ml-(--logo-offset) 768:ml-0 richtext richtext--link-colored text-18"
              style={{ gridRowStart: textRowStart }}
              variants={scrollReveal.itemVariants}
              dangerouslySetInnerHTML={text}
            />
          )}

          {/* Downloads */}
          {downloads.length > 0 && (
            <>
              {/* Headline */}
              <motion.div
                className="mt-20 768:mt-30 1024:mt-40 col-[content/content] 768:col-end-10 1024:col-end-7 ml-(--logo-offset) max-w-72"
                style={{ gridRowStart: downloadsRowStart }}
                variants={scrollReveal.itemVariants}
              >
                <h2 className="headline--1">{downloadsHeadline}</h2>
              </motion.div>

              {/* Downloads */}
              <motion.div
                className="mt-8 768:mt-14 col-[content/content] 768:col-end-10 1024:col-[7/12]"
                style={{ gridRowStart: downloadsRowStart + 1 }}
                variants={scrollReveal.itemVariants}
              >
                <ul className="flex flex-col gap-y-4 768:gap-y-6">
                  {downloads.map((download) => (
                    <li key={download.id}>
                      <a
                        href={download.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-between gap-x-4 pb-1.5 border-b border-dashed border-ci-dark hover:text-ci-light transition-colors duration-250"
                      >
                        <span className="text-18 uppercase">
                          {download.title}
                        </span>
                        <Download className="shrink-0 size-6" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </>
          )}
        </motion.section>
      </div>
    </>
  );
}
