import type { Text } from "#/lib/text";
import parse from "html-react-parser";

type Props = {
  title: string;
  introText?: Text;
};

export default function SubpageIntro({ title, introText }: Props) {
  return (
    <section>
      <h1>{title}</h1>

      {!!introText?.html && (
        <div className="richtext">{parse(introText.html)}</div>
      )}
    </section>
  );
}
