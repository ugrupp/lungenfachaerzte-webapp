import { Image as ImageCmp } from "#/components/Image";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import type { TeamMember } from "#/queries/team";
import clsx from "clsx";
import { motion } from "motion/react";

const scrollReveal = createScrollRevealVariants();

type Props = {
  members: TeamMember[];
  className?: string;
};

export default function TeamMembersSecondary({ members, className }: Props) {
  if (members.length === 0) return null;

  return (
    <motion.section
      className={clsx("container-grid gap-y-14 1024:gap-y-20", className)}
      {...scrollReveal.containerProps}
    >
      {members.map((member, index) => (
        <motion.article
          key={member.id}
          className={clsx("col-[content/content] ml-(--logo-offset) 768:ml-0", {
            "768:col-[3/10] 1024:col-[7/12]": index % 2 === 0,
            "768:col-start-11 1024:col-start-13": index % 2 !== 0,
          })}
          variants={scrollReveal.itemVariants}
        >
          {/* Image */}
          {member.image && (
            <div className="aspect-316/260">
              <ImageCmp
                src={member.image.url}
                srcSet={member.image.srcset}
                alt={member.image.alt}
                focalPoint={member.image.focalPoint}
                sizes="100vw"
                className="size-full object-cover"
              />
            </div>
          )}

          {/* Name */}
          <h2 className="headline--3 mt-8">{member.title}</h2>

          {/* Description */}
          {!!member.description?.__html && (
            <div
              className="richtext richtext--on-ci-light text-18"
              dangerouslySetInnerHTML={member.description}
            />
          )}
        </motion.article>
      ))}
    </motion.section>
  );
}
