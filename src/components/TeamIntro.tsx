import { createScrollRevealVariants } from "#/lib/scrollReveal";
import clsx from "clsx";
import { motion } from "motion/react";

const scrollReveal = createScrollRevealVariants();

type Props = {
  title: string;
  className?: string;
};

export default function SubpageIntro({ title, className }: Props) {
  return (
    <motion.section
      className={clsx(
        "container-grid gap-y-8 768:gap-y-0 1024:gap-y-16",
        className,
      )}
      variants={scrollReveal.container}
      initial="hidden"
      whileInView="visible"
      viewport={scrollReveal.viewport}
    >
      {/* Headline */}
      <motion.div
        className="col-[content/content] ml-(--logo-offset) 768:grid-row-1"
        variants={scrollReveal.item}
      >
        <h1 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full px-7 py-2.75 overflow-hidden">
          {title}
        </h1>
      </motion.div>
    </motion.section>
  );
}
