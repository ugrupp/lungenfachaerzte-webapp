import { useEffect, useState } from "react";

export function useMobileMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMenuOpen(false);
        setPanelVisible(false);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return { menuOpen, setMenuOpen, panelVisible, setPanelVisible };
}
