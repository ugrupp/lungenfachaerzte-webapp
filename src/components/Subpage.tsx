import type { Image } from "#/lib/image";
import SubHeader from "./SubHeader";

type Props = {
  heroImage?: Image | null;
};

export default function Subpage({ heroImage }: Props) {
  return <SubHeader heroImage={heroImage} />;
}
