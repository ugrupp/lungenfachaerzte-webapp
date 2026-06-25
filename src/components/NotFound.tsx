import { createScrollRevealVariants } from "#/lib/scrollReveal";
import type { Text } from "#/lib/text";
import FourOFour from "#/svg/404.svg?react";
import Doctors from "#/svg/doctors.svg?react";
import Logo from "#/svg/logo.svg?react";
import { motion } from "motion/react";
import Button from "./Button";
import DesktopMenu from "./DesktopMenu";
import MobileMenuToggle from "./MobileMenuToggle";

const scrollReveal = createScrollRevealVariants();

type Props = {
  text?: Text;
};

export default function NotFound({ text }: Props) {
  return (
    <motion.section
      className="relative top-0 z-60 bg-ci-dark text-ci-light pb-30 min-h-screen container-grid items-start"
      {...scrollReveal.containerProps}
    >
      {/* Navigation */}
      <div
        className="col-end-[content-end] w-fit justify-self-end sticky top-0 bottom-0 z-50 pt-8 row-start-1"
        id="navigation"
      >
        <DesktopMenu onCiDark className="max-1280:hidden" />
        <MobileMenuToggle inverted />
      </div>

      {/* Logo */}
      <div className="1024:sticky top-0 bottom-0 pt-8 col-start-[content] flex flex-col items-start gap-y-8 row-start-1">
        <a href="/" className="block ml-(--logo-offset) h-[95.37px] w-fit">
          <Logo className="h-full w-auto" />
          <span className="sr-only">Zur Startseite</span>
        </a>

        <Doctors />
      </div>

      {/* 404 graphic */}
      <motion.div
        className="col-[content/content] max-768:ml-(--logo-offset) 768:col-start-11 1024:col-start-13 mt-23 768:mt-39.75 flex flex-col items-start row-start-2 768:row-start-1"
        variants={scrollReveal.itemVariants}
      >
        <FourOFour className="w-full h-auto max-w-98 ml-auto" />
        <p className="sr-only">404</p>
      </motion.div>

      {/* Text + CTA */}
      <motion.div
        className="col-[content/content] max-1024:ml-(--logo-offset) 768:col-[content/11] 1024:col-[7/12] mt-23 768:mt-15 row-start-3 768:row-start-2"
        variants={scrollReveal.itemVariants}
      >
        {/* Primary text */}
        {!!text?.__html && (
          <div
            className="richtext richtext--on-ci-dark text-18 leading-snug"
            dangerouslySetInnerHTML={text}
          />
        )}

        <Button href="/" variant="on-ci" className="mt-6">
          Startseite
        </Button>
      </motion.div>
    </motion.section>
  );
}
