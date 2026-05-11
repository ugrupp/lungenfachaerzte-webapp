import type { Text } from "#/lib/text";

type Props = {
  title: string;
  introText?: Text;
};

export default function SubpageIntro({ title, introText }: Props) {
  return (
    <section>
      <h1>{title}</h1>

      {!!introText?.__html && (
        <div className="richtext" dangerouslySetInnerHTML={introText} />
      )}
    </section>
  );
}
