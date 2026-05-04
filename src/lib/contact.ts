export const isContactPagePath = (pathname: string): boolean =>
  /^\/kontakt(?:\/|$)/.test(pathname);
