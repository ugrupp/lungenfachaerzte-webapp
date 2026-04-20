import { useEffect } from "react";

/**
 * Intercepts all same-page hash link clicks (<a href="#...">)
 * via event delegation, preventing TanStack Router from handling
 * them (which would trigger a view transition).
 */
export function HashLinkHandler() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href?.startsWith("#")) return;

      const el = document.querySelector(href);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
