export const contact = {
  email: "tranhuydang2007@gmail.com", // TODO(Dang): real email
  socials: [
    { label: "instagram", href: "https://www.instagram.com/_huydangtran/" }, // TODO(Dang): profile URL
    // { label: "linkedin", href: "https://www.linkedin.com/" }, // TODO(Dang): profile URL
    { label: "github", href: "https://github.com/w41k3r15320" }, // TODO(Dang): profile URL
  ],
};

export const marqueeWords = [
  "Graphic Design",
  "Video Editing",
  "Motion Graphics",
  "Visual Identity",
  "Vocaloid MVs (yes)",
  "& more",
];

export const descriptionSlides = [
  "I am Dang, a graphic designer, video editor, and [amateur] motion graphics artist.",
  "This portfolio is still W.I.P, but welcome nonetheless!",
];

export const navLinks = [
  ["About", "#about"],
  ["Works", "#works"],
  ["Contact", "#contact"],
] as const;

export const menuLinks = [
  ["About.", "#about", "About"],
  ["Works.", "#works", "Works"],
  ["Contact.", "#contact", "Contact"],
] as const;
