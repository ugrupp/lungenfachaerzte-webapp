import { Image as ImageCmp } from "#/components/Image";
import { nl2br } from "#/lib/nl2br";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import type { TeamMember } from "#/queries/team";
import Ellipsis from "#/svg/ellipsis.svg?react";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const scrollReveal = createScrollRevealVariants();

type Props = {
  members: TeamMember[];
  className?: string;
};

function VitaToggle({ vita }: { vita: TeamMember["vita"] }) {
  const [open, setOpen] = useState(false);
  // detailsOpen stays true until the exit animation finishes so the
  // content remains in the DOM and the slide-up can play.
  const [detailsOpen, setDetailsOpen] = useState(false);

  const toggle = () => {
    if (!open) {
      setDetailsOpen(true);
      setOpen(true);
    } else {
      setOpen(false);
      // detailsOpen → false is handled by onExitComplete
    }
  };

  return (
    <details open={detailsOpen}>
      <summary
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        className="list-none [&::-webkit-details-marker]:hidden cursor-pointer inline-flex gap-x-1 whitespace-nowrap group"
      >
        {/* Icon */}
        <span className="flex items-center justify-center rounded-full bg-white group-hover:bg-ci-dark size-7.5 transition-colors duration-250">
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="flex items-center justify-center"
          >
            <Ellipsis className="size-3.5 text-ci-light" />
          </motion.span>
        </span>

        {/* Text */}
        <span className="px-4 h-7.5 text-16 tracking-wide uppercase text-ci-light bg-white group-hover:bg-ci-dark rounded-full flex items-center transition-colors duration-250">
          <span className="translate-y-[0.05em]">Vita</span>
        </span>
      </summary>

      <AnimatePresence
        initial={false}
        onExitComplete={() => setDetailsOpen(false)}
      >
        {open && (
          <motion.div
            key="vita-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <dl className="space-y-5 mt-8 sm:mt-11">
              {vita.map((item) => (
                <div key={item.id}>
                  <dt className="text-16 font-bold uppercase">{item.title}</dt>
                  {!!item.occupation?.__html && (
                    <dd
                      className="pl-15 richtext richtext--on-ci-dark-light text-16"
                      dangerouslySetInnerHTML={item.occupation}
                    />
                  )}
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </details>
  );
}

export default function TeamMembersPrimary({ members, className }: Props) {
  if (members.length === 0) return null;

  return (
    <section
      className={clsx("space-y-30 768:space-y-44 1024:space-y-50", className)}
    >
      {members.map((member) => (
        <motion.article
          key={member.id}
          className="container-grid"
          {...scrollReveal.containerProps}
        >
          {/* Name */}
          <motion.h2
            className="col-[content/content] 768:col-end-10 1024:col-end-7 1024:row-start-1 768:self-end ml-(--logo-offset) 1024:pr-8 headline--1"
            dangerouslySetInnerHTML={nl2br(member.title ?? "")}
            variants={scrollReveal.itemVariants}
          />

          {/* Image */}
          {member.image && (
            <motion.div
              className="col-[content/content] 768:col-start-11 1024:col-[7/12] 1024:row-start-1 ml-(--logo-offset) 768:ml-0 mt-10 768:mt-0"
              variants={scrollReveal.itemVariants}
            >
              <ImageCmp
                src={member.image.url}
                srcSet={member.image.srcset}
                alt={member.image.alt}
                focalPoint={member.image.focalPoint}
                sizes="100vw"
                className="w-full aspect-285/235 object-cover"
              />
            </motion.div>
          )}

          {/* Description */}
          {!!member.description?.__html && (
            <motion.div
              className="col-[content/content] 768:col-end-10 1024:col-[13/content] 1024:row-start-2 richtext richtext--on-ci-dark-light text-18 mt-10 768:mt-8 1280:mt-14"
              dangerouslySetInnerHTML={member.description}
              variants={scrollReveal.itemVariants}
            />
          )}

          {/* Vita */}
          {member.vita.length > 0 && (
            <motion.div
              className="col-[content/content] 768:col-[6/14] 1024:col-[7/12] 1024:row-start-3 ml-(--logo-offset) 768:ml-0 mt-10 768:mt-8 1280:mt-13"
              variants={scrollReveal.itemVariants}
            >
              <VitaToggle vita={member.vita} />
            </motion.div>
          )}
        </motion.article>
      ))}
    </section>
  );
}
