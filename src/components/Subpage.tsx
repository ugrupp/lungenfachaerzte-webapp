import type { Image } from "#/lib/image";
import type { Text } from "#/lib/text";
import SubHeader from "./SubHeader";
import SubpageContent from "./SubpageContent";
import SubpageIntro from "./SubpageIntro";

type Props = {
  subHeaderProps: {
    mainImage?: Image;
  };
  subpageIntroProps: {
    title: string;
    introText?: Text;
  };
  subpageContentProps: {
    image?: Image;
    image2?: Image;
    image3?: Image;
    image4?: Image;
    text?: Text;
    text2?: Text;
    text3?: Text;
  };
};

export default function Subpage({
  subHeaderProps,
  subpageIntroProps,
  subpageContentProps,
}: Props) {
  return (
    <>
      <SubHeader {...subHeaderProps} />
      <SubpageIntro {...subpageIntroProps} />
      <SubpageContent {...subpageContentProps} />
    </>
  );
}
