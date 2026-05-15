import { stagger } from "motion";
import type { MotionProps, Variants } from "motion/react";

export function createScrollRevealVariants() {
  const containerProps: MotionProps = {
    variants: {
      hidden: {},
      visible: {
        transition: {
          delayChildren: stagger(0.16, { from: "first" }),
        },
      },
    },
    initial: "hidden",
    whileInView: "visible",
    viewport: {
      once: true,
      amount: "some",
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        visualDuration: 0.5,
        bounce: 0.2,
      },
    },
  };

  return {
    containerProps,
    itemVariants,
  };
}
