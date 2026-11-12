"use client";
import { withBasePath } from "@/lib/base-path";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteMenu } from "./Chrome";
import { usePageTransition } from "./PageTransition";
import { getImageRows, getVideo, type Project, type ProjectMedia } from "./projects";

function imageSizes(item: ProjectMedia, rowLength: number): string {
  if (rowLength === 1) {
    return `(max-width: 966px) 100vw, ${Math.min(item.width, 924)}px`;
  }
  const share = Math.round(100 / rowLength);
  return `(max-width: 966px) ${share}vw, ${Math.round(924 / rowLength)}px`;
}

export function ProjectView({ project }: { project: Project }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const video = getVideo(project);
  const rows = getImageRows(project);
  const { navigate, prefetch } = usePageTransition();

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  return (
    <>
      <SiteMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        onScrollTo={() => undefined}
        variant="project"
      />

      <main id="swup" className="main swup-in is-shown">
        <article className="project dang-project">
          <Link
            className="dang-project-back"
            href="/#works"
            aria-label="All works"
            onMouseEnter={() => prefetch("/#works")}
            onFocus={() => prefetch("/")}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return;
              }
              event.preventDefault();
              navigate("/#works");
            }}
          >
            All works
          </Link>

          <div className="dang-project-content">
            <header className="dang-project-info">
              <h1 className="dang-project-title">{project.title}</h1>
              <ul className="dang-project-tags" aria-label="Disciplines">
                {project.disciplines.map((discipline) => (
                  <li className="dang-project-tag" key={discipline}>
                    {discipline}
                  </li>
                ))}
              </ul>
              {/* TODO(Dang): write the project description in projects.ts */}
              <p
                className="dang-project-description"
                data-placeholder={
                  project.description ? undefined : "project-description"
                }
              >
                {project.description || "Project description coming soon."}
              </p>
            </header>

            <div className="dang-project-media">
              {video ? (
                <div
                  className={`dang-project-video${
                    video.height > video.width ? " is-portrait" : ""
                  }`}
                >
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={video.poster ? withBasePath(video.poster) : undefined}
                    aria-label={video.alt}
                    style={{ aspectRatio: `${video.width} / ${video.height}` }}
                  >
                    <source src={withBasePath(video.src)} type="video/mp4" />
                  </video>
                </div>
              ) : null}

              {rows.map(({ row, items }) => (
                <div className="dang-project-row" key={row}>
                  {items.map((item) => {
                    const aspectRatio = item.width / item.height;
                    return (
                      <div
                        className={`dang-project-item${
                          items.length === 1 ? " is-single" : ""
                        }`}
                        key={item.src}
                        style={
                          items.length === 1
                            ? { maxWidth: `${item.width}px` }
                            : {
                                flex: `${aspectRatio} 1 0%`,
                                aspectRatio: `${item.width} / ${item.height}`,
                              }
                        }
                      >
                        <Image
                          src={withBasePath(item.src)}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                          loading="lazy"
                          sizes={imageSizes(item, items.length)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <footer className="dang-project-footer">
            <img
  className="dang-project-footer__logo"
  src={withBasePath("/sites/dang/logos/thd-white.svg")}
  alt="Dang (thd) logo"
/>
            <p className="dang-project-footer__copyright">
              2026 Tran Huy Dang
            </p>
            <Link className="dang-project-footer__link" href="/#contact">
              Contact
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
