"use client";

import Image from "next/image";
import main from "./hero-page-style/hero-main.module.css";
import about from "./hero-page-style/hero-about.module.css";
import { Button } from "@/components/ui/button";
import randomColor from "@/components/rndm-collor";
import InstagramIcon from "@/public/instagram.svg";
import TelegramIcon from "@/public/telegram.svg";
import GitHubIcon from "@/public/github.svg";
import TiktokIcon from "@/public/tiktok.svg";
import { Asterisk } from "lucide-react";
import ParticleText from "@/components/particleText";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "ReduxToolkit",
    "Express",
    "SEO",
    "API",
    "Sass",
    "Tailwind",
    "Git",
    "Figma",
  ];

  const listRef = useRef(null);
  const runRef = useRef(null);
  const [skillColors, setSkillColors] = useState(skills.map(() => 'transparent'));

  useEffect(() => {
    const updateWidth = () => {
      if (!listRef.current || !runRef.current) return;

      const width = listRef.current.getBoundingClientRect().width;
      runRef.current.style.setProperty("--list-width", `${width}px`);
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    setSkillColors(skills.map(() => randomColor()));

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className={main.wrapper}>
      <main className={main.main}>
        <div className={main.contacts}>
          <ul className={main.contactsList}>
            <li
              className={main.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="https://www.instagram.com/andrew_20o4/">
                <InstagramIcon />
              </a>
            </li>
            <li
              className={main.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <TelegramIcon />
              </a>
            </li>
          </ul>

          <div className={main.arrow}></div>
        </div>
        <div className={main.content}>
          <div className={main.info}>
            <h1 className={main.title}>
              <p>Andrii </p>
              Hrechukh
              <span className={main.subtitle}>
                {" "}
                Front-end <br />
                developer
              </span>
            </h1>
            <div className={`${main.imgBoxMobile} ${main.imgBox}`}>
              <Image
                className={main.image}
                src="/andrii.png"
                alt="Andrii Hrechukh"
                width={689}
                height={624}
                loading="eager"
              />
            </div>
            <div className={main.buttons}>
              <Button className={main.button}>Зв&apos;язатися</Button>
              <Button className={main.button}>Проекти</Button>
            </div>
          </div>

          <div className={main.imgBox}>
            <Image
              className={main.image}
              src="/andrii.png"
              alt="Andrii Hrechukh"
              width={689}
              height={624}
              loading="eager"
            />
          </div>

          <div className={main.contactsMobile}>
            <ul className={main.contactsList}>
              <li
                className={main.contactItem}
                onMouseEnter={(e) => (e.target.style.color = randomColor())}
                onMouseLeave={(e) => (e.target.style.color = "currentColor")}
              >
                <a href="https://www.instagram.com/andrew_20o4/">
                  <InstagramIcon />
                  Instagram
                </a>
              </li>
              <li
                className={main.contactItem}
                onMouseEnter={(e) => (e.target.style.color = randomColor())}
                onMouseLeave={(e) => (e.target.style.color = "currentColor")}
              >
                <a href="mailto:andrii.hrechukh@gmail.com">
                  <TelegramIcon />
                  Telegram
                </a>
              </li>
              <li
                className={main.contactItem}
                onMouseEnter={(e) => (e.target.style.color = randomColor())}
                onMouseLeave={(e) => (e.target.style.color = "currentColor")}
              >
                <a href="mailto:andrii.hrechukh@gmail.com">
                  <GitHubIcon />
                  GitHub
                </a>
              </li>
              <li
                className={main.contactItem}
                onMouseEnter={(e) => (e.target.style.color = randomColor())}
                onMouseLeave={(e) => (e.target.style.color = "currentColor")}
              >
                <a href="mailto:andrii.hrechukh@gmail.com">
                  <TiktokIcon />
                  Tiktok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={main.contacts}>
          <ul className={main.contactsList}>
            <li
              className={main.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <GitHubIcon />
              </a>
            </li>
            <li
              className={main.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <TiktokIcon />
              </a>
            </li>
          </ul>
          <div className={main.arrow}></div>
        </div>
      </main>

      <div className={main.runBox}>
        <div ref={runRef} className={main.run}>
          {[0, 1, 2].map((copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? listRef : null}
              className={main.skills}
            >
              {skills.map((skill, index) => (
                <li
                  key={`${copy}-${index}`}
                  className={main.skill}
                  style={{ color: skillColors[index] }}
                >
                  <strong>{skill}</strong>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section className={about.about}>
        <div className={about.titleBox}>
          <Asterisk className={about.titleIcon} size=".8em" />
          <h2 className="hidden">01 ABOUT ME</h2>

          <ParticleText
            text="ABOUT ME"
            fontSize="100%"
            fontWeight={700}
            color="currentColor"
            interactionRadius={100}
            interactionStrength={2}
            particleSize="5%"
            particleGap="5%"
          />

          <Asterisk className={about.titleIcon} size=".8em" />
        </div>
      </section>
    </div>
  );
}
