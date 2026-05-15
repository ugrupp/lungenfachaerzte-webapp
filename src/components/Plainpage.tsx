import {
  createScrollRevealVariants,
  scrollRevealInitial,
  scrollRevealWhileInView,
} from "#/lib/scrollReveal";
import type { Text } from "#/lib/text";
import { motion } from "motion/react";
import SubHeader from "./SubHeader";

const scrollReveal = createScrollRevealVariants();

type Props = {
  title: string;
  textPrimary?: Text;
  textSecondary?: Text;
};

export default function Plainpage({
  title,
  textPrimary,
  textSecondary,
}: Props) {
  return (
    <>
      <SubHeader />

      <div className="bg-off-white py-20 768:py-30 1024:pb-40">
        <motion.section
          className="container-grid"
          variants={scrollReveal.container}
          initial={scrollRevealInitial}
          whileInView={scrollRevealWhileInView}
          viewport={scrollReveal.viewport}
        >
          {/* Headline */}
          <motion.div
            className="col-[content/content] ml-(--logo-offset)"
            variants={scrollReveal.item}
          >
            <h1 className="w-fit headline--1 text-ci-light bg-ci-dark rounded-full px-7 py-2.75 overflow-hidden">
              {title}
            </h1>
          </motion.div>

          {/* Primary text */}
          {!!textPrimary?.__html && (
            <motion.div
              className="col-[content/content] 768:col-start-11 1024:col-start-13 mt-8 768:mt-14 1024:mt-16 richtext richtext--condensed text-18"
              variants={scrollReveal.item}
              dangerouslySetInnerHTML={textPrimary}
            />
          )}

          {/* Secondary text */}
          {!!textSecondary?.__html && (
            <motion.div
              className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] ml-(--logo-offset) 1024:ml-0 mt-8 768:mt-14 1024:mt-18 richtext richtext--condensed text-18"
              variants={scrollReveal.item}
              dangerouslySetInnerHTML={textSecondary}
            />
          )}
        </motion.section>
      </div>
    </>
  );
}
