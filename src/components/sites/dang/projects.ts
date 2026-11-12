export type Discipline = "Graphic Design" | "Video Editing" | "Motion Graphics";

export type ProjectMedia = {
  kind: "image" | "video";
  src: string;
  width: number;
  height: number;
  row?: number;
  column?: number;
  alt: string;
  poster?: string;
};

export type Project = {
  title: string;
  slug: string;
  banner: string;
  bannerWidth: number;
  bannerHeight: number;
  disciplines: Discipline[];
  description: string; // TODO(Dang): write each project description
  media: ProjectMedia[];
};

/**
 * Homepage and project-page source of truth.
 * TODO(Dang): reorder this array to change the order of the homepage works.
 */
export const projects: Project[] = [
  {
    title: "2025 SHOWREEL",
    slug: "2025-showreel",
    banner: "/sites/dang/projects/2025-showreel/banner.webp",
    bannerWidth: 1920,
    bannerHeight: 960,
    disciplines: ["Video Editing", "Motion Graphics"],
    description: "My 2025 video editing and motion graphics showreel", // TODO(Dang): write the project description in projects.ts
    media: [
      {
        kind: "video",
        src: "/sites/dang/projects/2025-showreel/output.webm",
        width: 1920,
        height: 1080,
        poster: "/sites/dang/projects/2025-showreel/banner.webp",
        alt: "2025 SHOWREEL film",
      },
    ],
  },
  {
    title: "GREENWICH IT CLUB",
    slug: "greenwich-it-club",
    banner: "/sites/dang/projects/greenwich-it-club/banner.webp",
    bannerWidth: 2000,
    bannerHeight: 1000,
    disciplines: ["Motion Graphics", "Graphic Design"],
    description: "Visual identity for Greenwich IT Club (GEN 10). Inspired by video games such as Persona 5, Jet Set Radio and hacker culture.", // TODO(Dang): write the project description in projects.ts
    media: [
      {
        kind: "video",
        src: "/sites/dang/projects/greenwich-it-club/output.webm",
        width: 1440,
        height: 1080,
        poster: "/sites/dang/projects/greenwich-it-club/banner.webp",
        alt: "GREENWICH IT CLUB film",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/greenwich-it-club/01-01.webp",
        width: 2000,
        height: 2000,
        row: 1,
        column: 1,
        alt: "GREENWICH IT CLUB — image 1.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/greenwich-it-club/01-02.webp",
        width: 2400,
        height: 1350,
        row: 1,
        column: 2,
        alt: "GREENWICH IT CLUB — image 1.2",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/greenwich-it-club/02-01.webp",
        width: 2400,
        height: 1143,
        row: 2,
        column: 1,
        alt: "GREENWICH IT CLUB — image 2.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/greenwich-it-club/03-01.webp",
        width: 1920,
        height: 1080,
        row: 3,
        column: 1,
        alt: "GREENWICH IT CLUB — image 3.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/greenwich-it-club/03-02.webp",
        width: 1920,
        height: 1080,
        row: 3,
        column: 2,
        alt: "GREENWICH IT CLUB — image 3.2",
      },
    ],
  },
  {
    title: "POSTER[S]",
    slug: "posters",
    banner: "/sites/dang/projects/posters/banner.webp",
    bannerWidth: 2000,
    bannerHeight: 1000,
    disciplines: ["Graphic Design"],
    description: "Personal projects. Various posters I made in my free time or to practice.", // TODO(Dang): write the project description in projects.ts
    media: [
      {
        kind: "image",
        src: "/sites/dang/projects/posters/01-01.webp",
        width: 2400,
        height: 960,
        row: 1,
        column: 1,
        alt: "POSTER[S] — image 1.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/02-01.webp",
        width: 2400,
        height: 960,
        row: 2,
        column: 1,
        alt: "POSTER[S] — image 2.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/03-01.webp",
        width: 2400,
        height: 960,
        row: 3,
        column: 1,
        alt: "POSTER[S] — image 3.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/04-01.webp",
        width: 2400,
        height: 960,
        row: 4,
        column: 1,
        alt: "POSTER[S] — image 4.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/05-01.webp",
        width: 2400,
        height: 960,
        row: 5,
        column: 1,
        alt: "POSTER[S] — image 5.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/06-01.webp",
        width: 2400,
        height: 1080,
        row: 6,
        column: 1,
        alt: "POSTER[S] — image 6.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/07-01.webp",
        width: 2400,
        height: 2400,
        row: 7,
        column: 1,
        alt: "POSTER[S] — image 7.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/posters/07-02.webp",
        width: 2000,
        height: 2000,
        row: 7,
        column: 2,
        alt: "POSTER[S] — image 7.2",
      },
    ],
  },
  {
    title: "VINSCHOOL MUSIC CLUB",
    slug: "vinschool-music-club",
    banner: "/sites/dang/projects/vinschool-music-club/banner.webp",
    bannerWidth: 2000,
    bannerHeight: 1000,
    disciplines: ["Graphic Design", "Motion Graphics"],
    description: "Visual identity for Vinschool Music Club (GEN 10)", // TODO(Dang): write the project description in projects.ts
    media: [
      {
        kind: "video",
        src: "/sites/dang/projects/vinschool-music-club/video.mp4",
        width: 1536,
        height: 1920,
        poster: "/sites/dang/projects/vinschool-music-club/banner.webp",
        alt: "VINSCHOOL MUSIC CLUB film",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vinschool-music-club/01-01.webp",
        width: 2400,
        height: 960,
        row: 1,
        column: 1,
        alt: "VINSCHOOL MUSIC CLUB — image 1.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vinschool-music-club/02-01.webp",
        width: 2000,
        height: 2000,
        row: 2,
        column: 1,
        alt: "VINSCHOOL MUSIC CLUB — image 2.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vinschool-music-club/02-02.webp",
        width: 1920,
        height: 2400,
        row: 2,
        column: 2,
        alt: "VINSCHOOL MUSIC CLUB — image 2.2",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vinschool-music-club/02-03.webp",
        width: 1920,
        height: 2400,
        row: 2,
        column: 3,
        alt: "VINSCHOOL MUSIC CLUB — image 2.3",
      },
    ],
  },
  {
    title: "VMC presents TQS",
    slug: "vmc-presents-the-quiet-soul",
    banner: "/sites/dang/projects/vmc-presents-the-quiet-soul/banner.webp",
    bannerWidth: 2000,
    bannerHeight: 1000,
    disciplines: ["Graphic Design"],
    description: "Visual identity for the music show 'The Quiet Soul' by Vinschool Music Club.", // TODO(Dang): write the project description in projects.ts
    media: [
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/01-01.webp",
        width: 2400,
        height: 1200,
        row: 1,
        column: 1,
        alt: "VMC presents TQS — image 1.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/02-01.webp",
        width: 2400,
        height: 1200,
        row: 2,
        column: 1,
        alt: "VMC presents TQS — image 2.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/02-01b.webp",
        width: 2400,
        height: 1200,
        row: 2,
        column: 1,
        alt: "VMC presents TQS — image 2.1, alternate",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/03-01.webp",
        width: 2400,
        height: 1200,
        row: 3,
        column: 1,
        alt: "VMC presents TQS — image 3.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/04-01.webp",
        width: 2400,
        height: 1200,
        row: 4,
        column: 1,
        alt: "VMC presents TQS — image 4.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/05-01.webp",
        width: 2400,
        height: 1200,
        row: 5,
        column: 1,
        alt: "VMC presents TQS — image 5.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-the-quiet-soul/06-01.webp",
        width: 2400,
        height: 1200,
        row: 6,
        column: 1,
        alt: "VMC presents TQS — image 6.1",
      },
    ],
  },
  {
    title: "VMC presents TRẠM",
    slug: "vmc-presents-tram",
    banner: "/sites/dang/projects/vmc-presents-tram/banner.webp",
    bannerWidth: 2000,
    bannerHeight: 1000,
    disciplines: ["Graphic Design"],
    description: "Visual identity for the music show 'TRẠM' by Vinschool Music Club.", // TODO(Dang): write the project description in projects.ts
    media: [
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-tram/01-01.webp",
        width: 2400,
        height: 961,
        row: 1,
        column: 1,
        alt: "VMC presents TRẠM — image 1.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-tram/02-01.webp",
        width: 1920,
        height: 2400,
        row: 2,
        column: 1,
        alt: "VMC presents TRẠM — image 2.1",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-tram/02-02.webp",
        width: 1920,
        height: 2400,
        row: 2,
        column: 2,
        alt: "VMC presents TRẠM — image 2.2",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-tram/02-03.webp",
        width: 1920,
        height: 2400,
        row: 2,
        column: 3,
        alt: "VMC presents TRẠM — image 2.3",
      },
      {
        kind: "image",
        src: "/sites/dang/projects/vmc-presents-tram/03-01.webp",
        width: 850,
        height: 330,
        row: 3,
        column: 1,
        alt: "VMC presents TRẠM — image 3.1",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export type ImageRow = {
  row: number;
  items: ProjectMedia[];
};

export function getImageRows(project: Project): ImageRow[] {
  const rows = new Map<number, ProjectMedia[]>();

  for (const item of project.media) {
    if (item.kind !== "image" || item.row === undefined) continue;
    const current = rows.get(item.row) ?? [];
    current.push(item);
    rows.set(item.row, current);
  }

  return Array.from(rows.entries())
    .sort(([a], [b]) => a - b)
    .map(([row, items]) => ({
      row,
      items: items.sort(
        (a, b) =>
          (a.column ?? 0) - (b.column ?? 0) ||
          a.src.localeCompare(b.src),
      ),
    }));
}

export function getVideo(project: Project): ProjectMedia | undefined {
  return project.media.find((item) => item.kind === "video");
}
