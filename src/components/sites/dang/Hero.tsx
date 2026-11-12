"use client";

import { useEffect, useRef, useState } from "react";
import { AbstractThin } from "./Marks";
import { descriptionSlides, navLinks } from "./site";
import { ThemeToggle } from "./ThemeToggle";

type HeroProps = {
  onScrollTo: (anchor: string) => void;
  descriptionIndex: number;
  setDescriptionIndex: (index: number) => void;
  descriptionRef: React.RefObject<HTMLDivElement | null>;
};

const titles = [
  {
    label: "graphic designer",
    lines: ["graphic", "designer"],
  },
  {
    label: "filmmaker",
    lines: ["video", "editor"],
  },
  {
    label: "motion graphics",
    lines: ["mograph", "artist"],
  },
] as const;

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>?/";

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function makeOrder(length: number) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rank = Array<number>(length).fill(0);
  order.forEach((charIndex, revealStep) => {
    rank[charIndex] = revealStep;
  });
  return rank;
}

export function Hero({
  onScrollTo,
  descriptionIndex,
  setDescriptionIndex,
  descriptionRef,
}: HeroProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayLines, setDisplayLines] = useState<string[]>([
    ...titles[0].lines,
  ]);
  const [scrambling, setScrambling] = useState(false);
  const [inView, setInView] = useState(false);
  const scrambleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setInView(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const scrambleTo = (nextIndex: number) => {
      if (scrambleTimerRef.current) {
        window.clearInterval(scrambleTimerRef.current);
      }
      const targetLines = titles[nextIndex].lines.map((l) => l);
      const ranks = targetLines.map((line) => makeOrder(line.length));
      const maxLen = Math.max(...targetLines.map((l) => l.length));
      let iteration = 0;
      setScrambling(true);

      scrambleTimerRef.current = window.setInterval(() => {
        setDisplayLines(
          targetLines.map((target, lineIndex) =>
            target
              .split("")
              .map((char, charIndex) => {
                if (char === " ") return " ";
                if (iteration > (ranks[lineIndex][charIndex] ?? 0)) {
                  return target[charIndex];
                }
                return randomChar();
              })
              .join(""),
          ),
        );

        iteration += 1 / 2;
        if (iteration > maxLen + 1) {
          if (scrambleTimerRef.current) {
            window.clearInterval(scrambleTimerRef.current);
            scrambleTimerRef.current = null;
          }
          setDisplayLines([...targetLines]);
          setTitleIndex(nextIndex);
          setScrambling(false);
        }
      }, 30);
    };

    const timer = window.setInterval(() => {
      setTitleIndex((index) => {
        const next = (index + 1) % titles.length;
        scrambleTo(next);
        return index;
      });
    }, 5000);

    return () => {
      window.clearInterval(timer);
      if (scrambleTimerRef.current) {
        window.clearInterval(scrambleTimerRef.current);
      }
    };
  }, []);

  const handleDescriptionScroll = () => {
    const track = descriptionRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    setDescriptionIndex(index);
  };

  return (
    <section
      id="intro"
      className={`js-infos homepage__infos dang-hero${inView ? " is-in" : ""}`}
    >
      <div className="logo-full-container logo-full-container--infos">
        <div className="logo-full-img--infos dang-hero__mark">
          <AbstractThin />
        </div>
      </div>
      <section className="wrapper wrapper--infos">
        <nav className="homepage__nav">
          <ul className="homepage__nav-ul">
            {navLinks.map(([label, anchor]) => (
              <li className="homepage__nav-list" key={anchor}>
                <a
                  className="homepage__nav-link js-to-scroll"
                  href={anchor}
                  data-anchor={anchor}
                  data-underline
                  onClick={(event) => {
                    event.preventDefault();
                    onScrollTo(anchor);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="homepage__nav-list">
              <ThemeToggle />
            </li>
          </ul>
        </nav>

        <section className="homepage__infos-hi">
          <span>Hi,</span>
          <span>I am Dang.</span>
        </section>

        <h1
          className={`homepage__main-title${scrambling ? " is-scrambling" : ""}`}
          aria-label={titles[titleIndex].label}
        >
          <span className="homepage__title-variant is-current" aria-hidden="true">
            <span className="art-director-title">{displayLines[0]}</span>
            <span className="photographer-title">{displayLines[1]}</span>
          </span>
        </h1>

        <section className="homepage__description-dang dang-hero__description">
          <section className="js-scroll-container-infos scroll-container scroll-container--infos dang-desc">
            <section
              ref={descriptionRef}
              className="js-slider-infos homepage__description-scroll dang-desc__track"
              onScroll={handleDescriptionScroll}
            >
              {descriptionSlides.map((slide, index) => (
                <section
                  key={slide}
                  className={`js-slider-item ${
                    index === 0
                      ? "homepage__description-first"
                      : "homepage__description-second"
                  }`}
                >
                  {slide}
                </section>
              ))}
            </section>
            <nav
              className="js-scroll-nav scroll-nav scroll-nav--infos dang-dots dang-desc__dots"
              aria-label="Description"
            >
              {descriptionSlides.map((slide, index) => (
                <button
                  key={slide}
                  type="button"
                  className={`scroll-pagination${
                    descriptionIndex === index ? " scroll-pagination--active" : ""
                  }`}
                  aria-label={`Description ${index + 1}`}
                  onClick={() => {
                    const track = descriptionRef.current;
                    track?.scrollTo({
                      left: index * track.clientWidth,
                      behavior: "smooth",
                    });
                    setDescriptionIndex(index);
                  }}
                />
              ))}
            </nav>
            <button
              type="button"
              className="button-slide button-slide--next dang-desc__arrow"
              aria-label="Next description"
              onClick={() => {
                const next = (descriptionIndex + 1) % descriptionSlides.length;
                const track = descriptionRef.current;
                track?.scrollTo({
                  left: next * track.clientWidth,
                  behavior: "smooth",
                });
                setDescriptionIndex(next);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="15"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path stroke="currentColor" d="m1 14 6.5-6.5L1 1" />
              </svg>
            </button>
          </section>
        </section>

        <button
          type="button"
          className="js-to-scroll link__scrollable link__scrollable--description h4 uppercase bold chevron-bounce"
          data-anchor="#works"
          onClick={() => onScrollTo("#works")}
        >
          <span className="hint-nudge">
            <span className="hint-nudge__word">Explore my work</span>
          </span>
        </button>
      </section>
      <div className="hint-band" aria-hidden="true">
        <button
          type="button"
          className="hint-band__label link__scrollable h4 uppercase bold chevron-bounce"
          tabIndex={-1}
        >
          <span className="hint-nudge">
            <span className="hint-nudge__word">Explore my work</span>
          </span>
        </button>
      </div>
    </section>
  );
}
