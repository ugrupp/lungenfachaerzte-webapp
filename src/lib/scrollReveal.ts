import { stagger } from "motion";
import type { Variants, ViewportOptions } from "motion/react";

type StaggerOptions = NonNullable<Parameters<typeof stagger>[1]>;

export type ScrollRevealOptions = {
  distance?: number;
  visualDuration?: number;
  bounce?: number;
  staggerDelay?: number;
  staggerFrom?: StaggerOptions["from"];
  viewportAmount?: ViewportOptions["amount"];
};

export const scrollRevealInitial = "hidden";
export const scrollRevealWhileInView = "visible";

export function createScrollRevealVariants(options: ScrollRevealOptions = {}): {
  container: Variants;
  item: Variants;
  viewport: ViewportOptions;
} {
  const {
    distance = 24,
    visualDuration = 0.5,
    bounce = 0.2,
    staggerDelay = 0.16,
    staggerFrom = "first",
    viewportAmount = 0.2,
  } = options;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: stagger(staggerDelay, { from: staggerFrom }),
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        visualDuration,
        bounce,
      },
    },
  };

  const viewport: ViewportOptions = {
    once: true,
    amount: viewportAmount,
  };

  return {
    container,
    item,
    viewport,
  };
}
