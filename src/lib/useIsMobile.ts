"use client";

import { useEffect, useState } from "react";

// Deliberately false during SSR and the first client render so hydration
// matches, then corrected in an effect. Anything gated on this must therefore
// tolerate one render at the desktop value.
export function useIsMobile(query = "(max-width: 767px)"): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return isMobile;
}
