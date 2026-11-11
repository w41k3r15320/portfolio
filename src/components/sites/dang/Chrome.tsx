"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AbstractThin } from "./Marks";
import { menuLinks } from "./site";

type SiteMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScrollTo: (anchor: string) => void;
  variant?: "home" | "project";
};

export function SiteMenu({
  open,
  onOpenChange,
  onScrollTo,
  variant = "home",
}: SiteMenuProps) {
  const [visible, setVisible] = useState(variant === "project");
  const [onLight, setOnLight] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    const heroNav = document.querySelector(".homepage__nav");
    if (!heroNav) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(heroNav);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      if (open) {
        setOnLight(false);
        return;
      }
      const x = Math.max(0, window.innerWidth - 46);
      const y = 48;
      const lightSection = document
        .elementsFromPoint(x, y)
        .filter((element) => !element.closest(".menu-toggle, #js-menu"))
        .map((element) =>
          element.closest(
            "#intro, .homepage__works, .dang-project, .dang-project-footer",
          ),
        )
        .find(Boolean);
      setOnLight(Boolean(lightSection));
    };
    const schedule = () => {
      if (!rafRef.current) rafRef.current = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  return (
    <>
      <button
        type="button"
        id="js-menu-button"
        className={`menu-toggle menu-toggle--site${
          visible || open ? " is-visible" : ""
        }${onLight && !open ? " is-on-light" : ""}`}
        aria-label={open ? "Close menu" : "Menu"}
        aria-controls="js-menu"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <span className="menu-toggle-bar menu-toggle-bar--top" />
        <span className="menu-toggle-bar menu-toggle-bar--middle" />
        <span className="menu-toggle-bar menu-toggle-bar--bottom" />
      </button>

      <nav
        id="js-menu"
        className={`menu menu--site${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <span className="dang-menu-backdrop" aria-hidden="true" />
        <ul className="menu-ul">
          {menuLinks.map(([label, anchor, title], index) => (
            <li
              className="menu-li"
              style={{ "--i": index } as React.CSSProperties}
              key={anchor}
            >
              <a
                className="menu-link"
                href={variant === "home" ? anchor : `/${anchor}`}
                data-title={title}
                data-underline
                onClick={(event) => {
                  if (variant !== "home") return;
                  event.preventDefault();
                  onOpenChange(false);
                  window.setTimeout(() => onScrollTo(anchor), 80);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export function Intro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const finish = useCallback(() => {
    setLeaving(true);
    document.documentElement.classList.remove("is-intro");
    try {
      window.localStorage.setItem("dang:intro-seen", String(Date.now()));
      window.sessionStorage.setItem("dang-intro", "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setShow(false), 620);
  }, []);

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen =
        window.localStorage.getItem("dang:intro-seen") ??
        window.sessionStorage.getItem("dang-intro");
    } catch {
      seen = "1";
    }
    if (seen) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      try {
        window.localStorage.setItem("dang:intro-seen", String(Date.now()));
        window.sessionStorage.setItem("dang-intro", "1");
      } catch {
        /* ignore */
      }
      return;
    }

    document.documentElement.classList.add("is-intro");
    const frame = window.requestAnimationFrame(() => setShow(true));
    const timeout = window.setTimeout(finish, 1700);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [finish]);

  if (!show) return null;

  return (
    <div
      className={`dang-intro${leaving ? " is-leaving" : ""}`}
      role="presentation"
      onClick={finish}
    >
      <AbstractThin className="dang-intro__mark" />
      <p className="dang-intro__hi">Hi, I am Dang.</p>
      <button
        type="button"
        className="dang-intro__skip"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
      >
        Skip
      </button>
    </div>
  );
}
