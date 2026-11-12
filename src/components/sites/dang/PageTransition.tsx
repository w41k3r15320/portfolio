"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type PageTransitionContextValue = {
  navigate: (href: string) => void;
  prefetch: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue>({
  navigate: () => undefined,
  prefetch: () => undefined,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

function FadeOverlay() {
  const [opaque, setOpaque] = useState(true);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpaque(false);
      });
    });
    const timeout = window.setTimeout(() => setActive(false), 1000);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="dang-page-fade"
      style={{ opacity: opaque ? 1 : 0 }}
    />
  );
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!navigating) return;
    // when navigation completes, pathname changes and FadeOverlay remounts;
    // clear local navigating state shortly after
    const timeout = window.setTimeout(() => {
      setNavigating(false);
      setFadeOut(false);
    }, 1200);
    return () => window.clearTimeout(timeout);
  }, [navigating, pathname]);

  const prefetch = useCallback(
    (href: string) => {
      try {
        router.prefetch(href);
      } catch {
        /* ignore */
      }
    },
    [router],
  );

  const navigate = useCallback(
    (href: string) => {
      if (navigating) return;
      setNavigating(true);
      router.prefetch(href);
      // start fade-out on next frames
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setFadeOut(true));
      });
      window.setTimeout(() => {
        router.push(href);
      }, 1000);
    },
    [navigating, router],
  );

  return (
    <PageTransitionContext.Provider value={{ navigate, prefetch }}>
      {children}
      <FadeOverlay key={pathname} />
      {navigating ? (
        <div
          aria-hidden="true"
          className="dang-page-fade"
          style={{ opacity: fadeOut ? 1 : 0 }}
        />
      ) : null}
    </PageTransitionContext.Provider>
  );
}
