"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(true);
  const [opaque, setOpaque] = useState(true);
  const navigatingRef = useRef(false);
  const prevPathnameRef = useRef(pathname);

  // Fade in on initial mount and whenever pathname changes (after navigation)
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      navigatingRef.current = false;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpaque(false);
      });
    });
    const timeout = window.setTimeout(() => {
      if (!navigatingRef.current) setActive(false);
    }, 1000);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

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
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      router.prefetch(href);
      setActive(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpaque(true);
        });
      });
      window.setTimeout(() => {
        router.push(href);
      }, 1000);
    },
    [router],
  );

  return (
    <PageTransitionContext.Provider value={{ navigate, prefetch }}>
      {children}
      {active ? (
        <div
          aria-hidden="true"
          className="dang-page-fade"
          style={{ opacity: opaque ? 1 : 0 }}
        />
      ) : null}
    </PageTransitionContext.Provider>
  );
}
