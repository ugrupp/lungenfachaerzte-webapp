export function nl2br(text: string) {
  const escaped = text.replaceAll(/\r?\n/g, "<br />");

  return { __html: escaped };
}
