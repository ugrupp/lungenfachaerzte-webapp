import { Image as ImageCmp } from "#/components/Image";
import type { Image } from "#/lib/image";
import type { Text } from "#/lib/text";
import parse from "html-react-parser";

type Props = {
  image?: Image;
  image2?: Image;
  image3?: Image;
  image4?: Image;
  text?: Text;
  text2?: Text;
  text3?: Text;
};

function ContentImage({ image }: { image?: Image }) {
  if (!image) return null;

  return (
    <div>
      <ImageCmp
        src={image.url}
        srcSet={image.srcset}
        alt={image.alt}
        focalPoint={image.focalPoint}
        sizes="100vw"
        className="w-full h-auto"
      />
    </div>
  );
}

function ContentText({ text }: { text?: Text }) {
  if (!text?.html) return null;

  return <div className="richtext">{parse(text.html)}</div>;
}

export default function SubpageContent({
  image,
  text,
  image2,
  image3,
  text2,
  image4,
  text3,
}: Props) {
  return (
    <section>
      <ContentImage image={image} />
      <ContentText text={text} />
      <ContentImage image={image2} />
      <ContentImage image={image3} />
      <ContentText text={text2} />
      <ContentImage image={image4} />
      <ContentText text={text3} />
    </section>
  );
}
