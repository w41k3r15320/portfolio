"use client";
import { withBasePath } from "@/lib/base-path";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "./projects";

export function WorksSection() {
  return (
    <section id="works" className="homepage__selected" data-nav-dark>
      <section className="homepage__selected-works">
        <section className="js-sw-title homepage__selected-works-title-container">
          <span className="js-pastille button-selected-pastille button-selected-pastille--large">
            {projects.length}
          </span>
          <h2 className="homepage__selected-works-title">
            selected <span>works</span>
            <span className="js-pastille button-selected-pastille button-selected-pastille--large-desktop">
              {projects.length}
            </span>
          </h2>
        </section>
      </section>

      <section className="homepage__works js-works-container">
        <section className="js-works homepage__works-list">
          {projects.map((project) => (
            <WorkCard key={project.slug} project={project} />
          ))}
        </section>
      </section>
    </section>
  );
}

function WorkCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 766px)");
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      observer = null;
      if (!media.matches) {
        setVisible(false);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          setVisible(entry.isIntersecting);
        },
        { rootMargin: "-50% 0% -50% 0%" },
      );
      observer.observe(element);
    };

    setup();
    media.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", setup);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href={`/works/${project.slug}`}
      className={`js-homepage-work homepage__work${
        project.slug === "2025-showreel" ? " is-blurred" : ""
      }${visible ? " visible" : ""}`}
      data-title={project.title}
      data-magnet
    >
      <section className="homepage__work-container">
        <p className="homepage__work-link">{project.title}</p>
      </section>
      <span className="homepage__work-categories">
        {project.disciplines.slice(0, 3).map((discipline) => (
          <span className="homepage__work-category" key={discipline}>
            {discipline}
          </span>
        ))}
      </span>
      <img
  className="js-home-work-media homepage__work--media"
  src={withBasePath(project.banner)}
  alt={`${project.title} banner`}
  width={project.bannerWidth}
  height={project.bannerHeight}
  loading="lazy"
/>
    </Link>
  );
}
