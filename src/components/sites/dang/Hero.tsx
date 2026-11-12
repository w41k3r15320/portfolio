"use client";

import { useEffect, useState } from "react";
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
    content: (
      <>
        <span className="art-director-title">graphic</span>
        <span className="photographer-title">designer</span>
      </>
    ),
  },
  {
    label: "filmmaker",
    content: (
      <>
        <span className="art-director-title">video</span>
        <span className="photographer-title">editor</span>
      </>
    ),
  },
  {
    label: "motion graphics",
    content: (
      <>
        <span className="art-director-title">mograph</span>
        <span className="photographer-title">artist</span>
      </>
    ),
  },
];

export function Hero({
  onScrollTo,
  descriptionIndex,
  setDescriptionIndex,
  descriptionRef,
}: HeroProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTitleIndex((index) => (index + 1) % titles.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setInView(true));
    return () => window.cancelAnimationFrame(id);
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

        <h1 className="homepage__main-title" aria-label={titles[titleIndex].label}>
          {titles.map((title, index) => (
            <span
              key={title.label}
              className={`homepage__title-variant${
                index === titleIndex ? " is-current" : ""
              }`}
              aria-hidden={index !== titleIndex}
              hidden={index !== titleIndex}
            >
              {title.content}
            </span>
          ))}
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
