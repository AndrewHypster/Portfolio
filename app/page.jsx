"use client";

import Image from "next/image";
import s from "./main.module.css";
import { Button } from "@/components/ui/button";
import randomColor from "@/components/rndm-collor";
import InstagramIcon from "@/public/instagram.svg";
import TelegramIcon from "@/public/telegram.svg";
import GitHubIcon from "@/public/github.svg";
import TiktokIcon from "@/public/tiktok.svg";

export default function Home() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "ReduxToolkit",
    "Express",
    "API",
    "Sass",
    "Tailwind",
    "Git",
    "Figma",
  ];

  const skillColors = skills.map(() => randomColor());

  return (
    <div className={s.wrapper}>
      <main className={s.main}>
        <div className={s.contacts}>
          <ul className={s.contactsList}>
            <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="https://www.instagram.com/andrew_20o4/">
                <InstagramIcon />
              </a>
            </li>
            <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <TelegramIcon />
              </a>
            </li>
          </ul>

          <div className={s.arrow}></div>
        </div>
        <div className={s.content}>

          <div className={s.info}>
            <h1 className={s.title}>
              <p>Andrii </p>
              Hrechukh
              <span className={s.subtitle}>
                {" "}
                Front-end <br />
                developer
              </span>
            </h1>
            <div className={`${s.imgBoxMobile} ${s.imgBox}`}>
              <Image
                className={s.image}
                src="/andrii.png"
                alt="Andrii Hrechukh"
                width={689}
                height={624}
              />
            </div>
            <div className={s.buttons}>
              <Button className={s.button}>Зв'язатися</Button>
              <Button className={s.button}>Проекти</Button>
            </div>
          </div>

          <div className={s.imgBox}>
            <Image
              className={s.image}
              src="/andrii.png"
              alt="Andrii Hrechukh"
              width={689}
              height={624}
            />
          </div>

          <div className={s.contactsMobile}>
            <ul className={s.contactsList}>
              <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="https://www.instagram.com/andrew_20o4/">
                <InstagramIcon />
                Instagram
              </a>
            </li>
            <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <TelegramIcon />
                Telegram
              </a>
            </li>
            <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <GitHubIcon />
                GitHub
              </a>
            </li>
            <li
              className={s.contactItem}
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

          <div className={s.runBox}>
            <div className={s.run}>
              <ul className={s.skills}>
                {skills.map((skill, index) => (
                  <li
                    key={index}
                    className={s.skill}
                    style={{ color: skillColors[index] }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
              <ul className={s.skills}>
                {skills.map((skill, index) => (
                  <li
                    key={`${skill}-${index}-copy`}
                    className={s.skill}
                    style={{ color: skillColors[index] }}
                  >
                    <strong>{skill}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={s.contacts}>
          <ul className={s.contactsList}>
            <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <GitHubIcon />
              </a>
            </li>
            <li
              className={s.contactItem}
              onMouseEnter={(e) => (e.target.style.color = randomColor())}
              onMouseLeave={(e) => (e.target.style.color = "currentColor")}
            >
              <a href="mailto:andrii.hrechukh@gmail.com">
                <TiktokIcon />
              </a>
            </li>
          </ul>
          <div className={s.arrow}></div>
        </div>
      </main>
    </div>
  );
}
