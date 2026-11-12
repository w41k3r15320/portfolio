import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import "./dang.css";
import { PageTransitionProvider } from "@/components/sites/dang/PageTransition";

const archivo = Archivo({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("dang:theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "Tran Huy Dang's Portfolio",
  description:
    "Portfolio of Tran Huy Dang  - graphic designer, filmmaker, and motion graphics artist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-intro="done"
      data-theme="light"
      className={archivo.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
