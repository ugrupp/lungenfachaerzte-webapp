import { Image as ImageCmp } from "#/components/Image";
import { nl2br } from "#/lib/nl2br";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import type { TeamMember } from "#/queries/team";
import clsx from "clsx";
import { motion } from "motion/react";

const scrollReveal = createScrollRevealVariants();

type Props = {
  members: TeamMember[];
  className?: string;
};

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
                className="h-auto w-full"
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
            <motion.dl
              className="col-[content/content] 768:col-[6/14] 1024:col-[7/12] 1024:row-start-3 ml-(--logo-offset) 768:ml-0 mt-10 768:mt-8 1280:mt-13 space-y-5"
              variants={scrollReveal.itemVariants}
            >
              {member.vita.map((item) => (
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
            </motion.dl>
          )}
        </motion.article>
      ))}
    </section>
  );
}
