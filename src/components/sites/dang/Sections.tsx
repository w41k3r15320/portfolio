"use client";
import { withBasePath } from "@/lib/base-path";
import { contact, marqueeWords } from "./site";

export function About() {
  return (
    <section id="about" className="homepage__what dang-about js-what" data-nav-dark>
      <section className="wrapper wrapper--what">
        <h2 className="homepage__what-title h4 bold white uppercase">
          Few words
        </h2>
        <section className="homepage__what-container">
          <p className="homepage__what-head-title">about me</p>
          <div className="homepage__what-marquee">
            <ul className="homepage__what-ul js-marquee">
              {marqueeWords.map((word) => (
                <li className="homepage__what-list" key={word}>
                  {word}
                </li>
              ))}
              {marqueeWords.map((word) => (
                <li
                  className="homepage__what-list homepage__what-list--copy"
                  aria-hidden="true"
                  key={`copy-${word}`}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
          <section className="homepage__what-text">
            {/* TODO(Dang): personalise this bio. */}
            <p>
              Hi, my name is Trần Huy Đăng. I&apos;m a graphic designer, video editor and motion graphic artist with experience creating visual content for clients, school clubs, YouTube channels, music videos, documentary or even some short film projects. I specialize in video editing and graphic design using DaVinci Resolve and Affinity.
            </p>
            <p>
              Alongside my design work, I&apos;m actively learning into software development with the goal of becoming a developer. 
            </p>
          </section>
        </section>
        {/* <div className="logo-small-container">
          <img
            src={withBasePath("/sites/dang/logos/thd-white.svg")}
            className="logo-small-img logo-static"
            alt="Dang (thd) logo"
          />
        </div> */}
      </section>
    </section>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="homepage__talk homepage__talk--home dang-contact"
      data-nav-dark
    >
      <div className="logo-full-container">
        <div className="logo-full-layer">
          <img
            src={withBasePath("/sites/dang/logos/thd-white.svg")}
            className="logo-full-img dang-contact__logo"
            alt="Dang (thd) logo"
          />
        </div>
      </div>
      <ul className="homepage__socials-ul">
        {contact.socials.map((social) => (
          <li className="homepage__socials-list" key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener"
              className="homepage__social"
              data-underline
            >
              {social.label}.
            </a>
          </li>
        ))}
      </ul>
      <a href={`mailto:${contact.email}`} className="homepage__talk-link">
        {contact.email}
      </a>
      <p className="dang-contact__copyright">© 2026 Tran Huy Dang</p>
    </section>
  );
}
