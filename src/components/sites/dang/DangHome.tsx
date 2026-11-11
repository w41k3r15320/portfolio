"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Intro, SiteMenu } from "./Chrome";
import { Hero } from "./Hero";
import { About, Contact } from "./Sections";
import { WorksSection } from "./WorksSection";

export function DangHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = useCallback((anchor: string) => {
    const target = document.querySelector(anchor);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      history.replaceState(history.state, "", anchor);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLElement>("[data-anchor]");
      if (!anchor) return;
      const value = anchor.dataset.anchor;
      if (!value) return;
      event.preventDefault();
      scrollTo(value);
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [scrollTo]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  return (
    <>
      <Intro />
      <SiteMenu open={menuOpen} onOpenChange={setMenuOpen} onScrollTo={scrollTo} />

      <main id="swup" className="main swup-in is-shown">
        <article id="js-home" className="homepage">
          <Hero
            onScrollTo={scrollTo}
            descriptionIndex={descriptionIndex}
            setDescriptionIndex={setDescriptionIndex}
            descriptionRef={descriptionRef}
          />

          <WorksSection />

          <About />

          <Contact />
        </article>
      </main>
    </>
  );
}
