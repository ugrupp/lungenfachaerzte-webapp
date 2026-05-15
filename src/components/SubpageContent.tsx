import { Image as ImageCmp } from "#/components/Image";
import type { Image } from "#/lib/image";
import { createScrollRevealVariants } from "#/lib/scrollReveal";
import type { Text } from "#/lib/text";
import { clsx } from "clsx";
import { motion } from "motion/react";

const scrollReveal = createScrollRevealVariants();

type ContentImageProps = {
  image?: Image;
  className?: string;
};

function ContentImage({ image, className }: ContentImageProps) {
  if (!image) return null;

  return (
    <motion.div
      className={clsx(className)}
      variants={scrollReveal.itemVariants}
    >
      <ImageCmp
        src={image.url}
        srcSet={image.srcset}
        alt={image.alt}
        focalPoint={image.focalPoint}
        sizes="100vw"
        className="w-full h-auto"
      />
    </motion.div>
  );
}

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

type Props = {
  image?: Image;
  image2?: Image;
  image3?: Image;
  image4?: Image;
  text?: Text;
  text2?: Text;
  text3?: Text;
  className?: string;
};

export default function SubpageContent({
  image,
  text,
  image2,
  image3,
  text2,
  image4,
  text3,
  className,
}: Props) {
  return (
    <motion.section
      className={clsx("container-grid", className)}
      {...scrollReveal.containerProps}
    >
      {/* Section 1 */}
      <ContentImage
        image={image}
        className="col-[content/content] 768:col-start-11 1024:col-[content/6] 768:row-start-1 ml-(--logo-offset) 768:ml-0 1024:ml-(--logo-offset) 1024:self-end"
      />

      <ContentText
        text={text}
        className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] 768:row-start-1 768:ml-(--logo-offset) 1024:ml-0 mt-18 768:mt-0"
      />

      <ContentImage
        image={image2}
        className="col-[content/content] 768:col-[7/13] 1024:col-[13/content] 768:row-start-2 1024:row-start-1 mx-(--logo-offset) 768:mx-0 mt-14 1024:mt-0"
      />

      {/* Section 2 */}
      <ContentText
        text={text2}
        className="col-[content/content] 768:col-start-11 1024:col-[13/content] 768:row-start-3 1024:row-start-2 mt-18 768:mt-23 1024:mt-36"
      />

      <ContentImage
        image={image3}
        className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] 768:row-start-3 1024:row-start-2 ml-(--logo-offset) 1024:ml-0 mt-18 768:mt-23 1024:mt-36"
      />

      {/* Section 3 */}
      <ContentText
        text={text3}
        className="col-[content/content] 768:col-[content/10] 1024:col-[7/12] 1024:row-start-3 768:ml-(--logo-offset) 1024:ml-0 mt-18 1024:mt-36"
      />

      <ContentImage
        image={image4}
        className="col-[content/content] 768:col-[7/13] 1024:col-[content/6] 1024:row-start-3 mx-(--logo-offset) 768:mx-0 1024:ml-(--logo-offset) mt-14 1024:mt-36"
      />
    </motion.section>
  );
}
