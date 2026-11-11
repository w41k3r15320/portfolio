# Publish the Dang portfolio to GitHub Pages

This guide turns the Next.js app into a static site in `out/` and deploys it with GitHub Actions.

Requires Node 24+ (`.nvmrc` pins 24). Tested with Next.js 16.3.5 and npm.

---

## 0. Pick the URL before you start

GitHub Pages has two common URL shapes. The choice determines whether the site needs a `basePath`.

| Option | Repository name | Public URL | Extra work |
| --- | --- | --- | --- |
| **Root user site** (simplest) | `<your-username>.github.io` | `https://<your-username>.github.io/` | None beyond the static export |
| **Project site** | any name, e.g. `dang-portfolio` | `https://<your-username>.github.io/dang-portfolio/` | Add `basePath` and prefix the `/sites/...` asset paths |
| **Custom domain** | any name | `https://yourdomain.com/` | DNS setup only; no `basePath` |

This site uses absolute asset paths such as `/sites/dang/projects/...`. Those paths work unchanged on a root user site or a custom domain. They do **not** work automatically on a project-site subpath.

- **Recommended:** use the root user site (`<your-username>.github.io`) or a custom domain. Follow sections 1–8.
- If you must use a repository subpath, follow section 9 before building.

---

## 1. Switch Next.js to static export

Edit `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

Why each option matters:

- `output: "export"` replaces `output: "standalone"` and makes `next build` write static files to `out/`.
- `images.unoptimized: true` is required because `src/components/sites/dang/ProjectView.tsx` uses `next/image`, and static hosting has no Next.js image optimizer.
- `trailingSlash: true` emits `out/works/<slug>/index.html` instead of `out/works/<slug>.html`. That lets GitHub Pages serve `https://.../works/<slug>/` without rewrite rules.

`out/` is already listed in `.gitignore`, so the build output will not be committed.

> **Docker note:** the repository's `Dockerfile` expects `output: "standalone"`. If you still need the Docker image, use a separate config or an environment switch for that build. For a GitHub Pages-only site, the config above is correct.

---

## 2. Build and preview locally

```bash
nvm use            # uses .nvmrc -> Node 24
npm ci
npm run build
```

The build should finish with a route table and create `out/`. Verify the important files:

```bash
ls out/index.html
ls out/works/2025-showreel/index.html
ls out/_next/static
ls out/sites/dang/projects/2025-showreel/video.mp4
```

Preview the exported site with any static file server:

```bash
npx --yes serve out -l 4000
# open http://localhost:4000
```

Or, without Node:

```bash
python3 -m http.server 4000 --directory out
# open http://localhost:4000
```

Check these before deploying:

- `/` loads and the intro overlay, menu, and hover effects work.
- `/works/2025-showreel/` loads directly (note the trailing slash).
- All six project routes load.
- Images and videos play from `/sites/dang/...`.
- The light/dark theme toggle persists after a reload.

`npm run start` no longer works after switching to `output: "export"` — a static export has no Next.js server. Use a static file server instead.

---

## 3. Prepare the repository

The working tree contains large, private source material that must not be published. In particular, `.new-portfolio/` is about **685 MB**. Add it and the local instruction notes to `.gitignore` before staging anything:

```gitignore
# Private source material / working notes
.new-portfolio/
new-portfolio-instructions.md
new-portfolio-additional-instructions.md
```

If any of those files are already staged, unstage them:

```bash
git rm -r --cached .new-portfolio 2>/dev/null || true
git rm --cached new-portfolio-instructions.md 2>/dev/null || true
git rm --cached new-portfolio-additional-instructions.md 2>/dev/null || true
```

Review what will be committed:

```bash
git status --short
git add -A
git status --short
```

Make sure `out/`, `.next/`, and `node_modules/` are not staged. They are already ignored.

Check for files that GitHub will reject (100 MB hard limit, 50 MB warning):

```bash
find public -type f -size +95M -print
git ls-files -z | xargs -0 du -h | sort -h | tail -20
```

The largest asset in this project is currently `public/sites/dang/projects/greenwich-it-club/video.mp4` at about **48.7 MB**, which is below GitHub's limit.

Commit the site:

```bash
git add -A
git commit -m "Build Dang portfolio for static hosting"
```

If Git does not know who you are:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

The current branch is `master`. Keep it, because `.github/workflows/ci.yml` and the new Pages workflow below target `master`. If you rename the branch to `main`, update the `branches:` list in **both** workflows.

---

## 4. Create the GitHub repository and push

Create an **empty** repository on GitHub. Do not initialize it with a README, `.gitignore`, or license, or the first push will conflict.

- For a root user site, name it exactly `<your-username>.github.io`.
- For a project site, use any name, e.g. `dang-portfolio`.

### Option A: GitHub CLI

Set your values once in the shell, then run the command:

```bash
GITHUB_USER="your-github-username"
REPO="${GITHUB_USER}.github.io"   # or "dang-portfolio" for a project site

gh auth login
gh repo create "$GITHUB_USER/$REPO" \
  --public \
  --source=. \
  --remote=origin \
  --push
```

### Option B: Plain Git

```bash
GITHUB_USER="your-github-username"
REPO="${GITHUB_USER}.github.io"   # or "dang-portfolio" for a project site

git remote add origin "https://github.com/$GITHUB_USER/$REPO.git"
git push -u origin master
```

If a remote already exists:

```bash
git remote set-url origin "https://github.com/$GITHUB_USER/$REPO.git"
```

For SSH instead of HTTPS:

```bash
git remote add origin "git@github.com:$GITHUB_USER/$REPO.git"
```

GitHub does not accept account passwords for HTTPS pushes. Use a personal access token or run `gh auth setup-git`.

After the push, confirm the repository contains `public/sites/`, `src/`, and the modified `next.config.ts`.

---

## 5. Add the GitHub Pages workflow

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Notes:

- `permissions` and `concurrency` are required for the official Pages deployment actions.
- For a root user site, `steps.pages.outputs.base_path` is empty, so `NEXT_PUBLIC_BASE_PATH` is empty and harmless.
- For a project site, that output is `/<repository>`. Section 9 explains how to make the app honour it.
- The workflow targets `master`. Change it to `main` if you renamed the branch.
- Actions-based Pages deployments do **not** run Jekyll, so `_next/` is served correctly without `.nojekyll`. If you add `public/.nojekyll` anyway, also set `include-hidden-files: true` on the upload step; otherwise the uploader skips dotfiles.

---

## 6. Enable GitHub Pages

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. If the repository is private, confirm your plan allows Pages for private repositories. A public repository is the simplest option.

You can also enable it from the CLI (requires admin access):

```bash
GITHUB_USER="your-github-username"
REPO="dang-portfolio"   # use your actual repository name

gh api -X POST "repos/$GITHUB_USER/$REPO/pages" \
  -f build_type=workflow
```

---

## 7. Push the workflow and verify

Commit and push the workflow:

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: deploy to GitHub Pages"
git push
```

Watch the run:

```bash
gh run list --workflow=deploy-pages.yml
gh run watch
```

Or open the repository's **Actions** tab and select **Deploy to GitHub Pages**.

When the `deploy` job finishes, it prints the site URL:

- Root user site: `https://<your-username>.github.io/`
- Project site: `https://<your-username>.github.io/<repository>/`

Verify:

- The home page loads over HTTPS.
- `/works/2025-showreel/` loads directly.
- Images and videos load from `/sites/dang/...` (or `/<repository>/sites/...` on a project site).
- The dark/light theme toggle still persists after reload.
- The browser console has no 404s for `_next/static/...`.

If the first run fails because Pages was not enabled yet, enable it in **Settings → Pages**, then re-run the failed job from the **Actions** tab.

---

## 8. Updating the site

Every push to `master` rebuilds and redeploys the site:

```bash
# edit content or styles
git add path/to/changed-file
git commit -m "Update portfolio content"
git push
```

Useful files:

| What to change | File |
| --- | --- |
| Project titles, descriptions, media, order | `src/components/sites/dang/projects.ts` |
| Email and social links | `src/components/sites/dang/site.ts` |
| Browser tab title and metadata | `src/app/layout.tsx` |
| Per-project tab titles | `src/app/works/[slug]/page.tsx` |
| Site-wide Dang styles and dark palette | `src/app/dang.css` |

Do not commit `out/`. The workflow rebuilds it from source every time.

---

## 9. Project-site URLs (repository subpath)

Use this section only if the site will live at `https://<your-username>.github.io/<repository>/`.

### 9.1 Add the base path

Edit `next.config.ts`:

```ts
import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
};

export default nextConfig;
```

`basePath` must not end with a slash. The `configure-pages` output is already in the correct form, e.g. `/dang-portfolio`.

Next applies `basePath` to `_next/` assets and `next/link` automatically. You need to prefix root-relative URLs used by plain tags (`<a>`, `<img>`, `<video>`, `<source>`) and `next/image`.

### 9.2 Add an asset helper

Create `src/lib/base-path.ts`:

```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!basePath) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
```

`NEXT_PUBLIC_BASE_PATH` is inlined at build time, so this works in client components.

### 9.3 Prefix the absolute asset paths

`next/link` applies `basePath` automatically, so the `All works`, `Contact`, and project-card links need no changes. Plain `<a>` links, `<img>`, `<video>`, `<source>`, and `next/image` sources do.

Keep the paths in `projects.ts` as `/sites/...`; wrap them where they are rendered so the same data works for both root and subpath deployments.

Update these files:

**`src/components/sites/dang/WorksSection.tsx`**

```tsx
import { withBasePath } from "@/lib/base-path";

// ...
<img
  className="js-home-work-media homepage__work--media"
  src={withBasePath(project.banner)}
  alt={`${project.title} banner`}
  width={project.bannerWidth}
  height={project.bannerHeight}
  loading="lazy"
/>
```

**`src/components/sites/dang/Chrome.tsx`**

The project-page menu uses plain anchors, so it needs the prefix too:

```tsx
import { withBasePath } from "@/lib/base-path";

// ...
<a
  className="menu-link"
  href={variant === "home" ? anchor : withBasePath(`/${anchor}`)}
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
```

**`src/components/sites/dang/ProjectView.tsx`**

```tsx
import { withBasePath } from "@/lib/base-path";

// video poster
poster={video.poster ? withBasePath(video.poster) : undefined}

// video source
<source src={withBasePath(video.src)} type="video/mp4" />

// next/image media
<Image
  src={withBasePath(item.src)}
  alt={item.alt}
  width={item.width}
  height={item.height}
  loading="lazy"
  sizes={imageSizes(item, items.length)}
/>

// footer logo
<img
  className="dang-project-footer__logo"
  src={withBasePath("/sites/dang/logos/thd-white.svg")}
  alt="Dang (thd) logo"
/>
```

**`src/components/sites/dang/Sections.tsx`**

```tsx
import { withBasePath } from "@/lib/base-path";

// both logo images
src={withBasePath("/sites/dang/logos/thd-white.svg")}
```

### 9.4 Test the subpath locally

```bash
REPO="dang-portfolio"

NEXT_PUBLIC_BASE_PATH="/$REPO" npm run build

rm -rf /tmp/dang-preview
mkdir -p "/tmp/dang-preview/$REPO"
cp -R out/. "/tmp/dang-preview/$REPO/"
npx --yes serve /tmp/dang-preview -l 4000
# open http://localhost:4000/$REPO/
```

Confirm the generated HTML uses the prefix:

```bash
REPO="dang-portfolio"
grep -o "/$REPO/_next[^\"]*" out/index.html | head
grep -o "/$REPO/sites[^\"]*" out/index.html | head
```

The workflow already passes `NEXT_PUBLIC_BASE_PATH` from `actions/configure-pages`, so no further workflow change is needed.

### 9.5 Custom domains

A custom domain serves the site at the domain root, so `configure-pages` returns an empty base path. The helper then returns paths unchanged. Keep the code generic and it will work for both.

---

## 10. Limits, assets, and things to avoid

- **GitHub file limit:** 100 MB per file (hard), 50 MB warning. The largest current asset is about 48.7 MB.
- **GitHub Pages site limit:** about 1 GB published. A full `out/` build is about 120 MB.
- **GitHub Pages bandwidth:** about 100 GB per month (soft limit). Large MP4s can use this quickly if the site gets traffic.
- **Do not use Git LFS for `public/sites/`.** GitHub Pages serves the files in the deployed artifact, not LFS pointers. Commit the real image and video files.
- **Do not commit `.new-portfolio/`.** It is about 685 MB and contains private working material.
- **Do not commit `out/`.** It is build output and is already ignored.
- **Public means public.** On a public repository, every image, video, and document in the repo can be downloaded. On most plans, the published Pages site is also publicly accessible even if the repository is private, so remove anything you do not want to publish and check your plan before uploading client material.
- If the videos grow or traffic increases, host the MP4s on YouTube, Vimeo, or object storage and reference those URLs instead of committing them.

---

## 11. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Build fails with an image optimisation error | Add `images: { unoptimized: true }` to `next.config.ts`. |
| No `out/` directory after `npm run build` | Make sure `output: "export"` replaced `output: "standalone"`. |
| `npm run start` fails | Static exports have no Next.js server. Preview with `npx serve out -l 4000` or `python3 -m http.server 4000 --directory out`. |
| Home page loads but CSS/JS 404s | The site is on a subpath but `basePath` or the asset prefix is missing. See section 9. |
| Project pages 404 | Confirm `trailingSlash: true` and that `out/works/<slug>/index.html` exists. Use the trailing slash in the URL. |
| Deploy job fails with a Pages permission error | Set **Settings → Pages → Source** to **GitHub Actions**, and keep the `permissions` block in the workflow. |
| Workflow does not run on push | Check the branch name in `on.push.branches` matches the branch you pushed. |
| Push rejected for a file over 100 MB | Remove the file from Git and keep it out of the repo, or host it externally. |
| Repository is huge after committing | `.new-portfolio/` was staged. Run `git rm -r --cached .new-portfolio`, add it to `.gitignore`, and commit. If it was already pushed, history rewriting is required. |
| Site shows an old version | Wait for the deployment to finish, then hard-refresh the browser. Check the latest run in the **Actions** tab. |
| Favicon 404s on a subpath | Confirm `src/app/icon.svg` exists; Next's metadata route applies `basePath` to it automatically. |

---

## 12. Optional: custom domain

1. In **Settings → Pages → Custom domain**, enter the domain and save.
2. Add DNS records at your domain provider:
   - Subdomain such as `www` or `portfolio`: `CNAME` to `<your-username>.github.io`.
   - Apex domain: use GitHub's current A/AAAA records, or an ALIAS/ANAME record if your provider supports it. Follow GitHub's latest custom-domain DNS documentation rather than copying old IPs.
3. Wait for DNS to propagate, then enable **Enforce HTTPS**.

With a custom domain, the site is served from the domain root, so no `basePath` is needed. If you also want the domain recorded in the deployed artifact, add a `public/CNAME` file containing only the domain name; otherwise the setting in **Settings → Pages** is sufficient for Actions-based deployments.
