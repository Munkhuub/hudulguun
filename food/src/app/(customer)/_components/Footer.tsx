import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FacebookIcon from "./_assets/FacebookIcon";

const FACEBOOK_URL = "https://www.facebook.com/Hudulguunmn";
const MESSENGER_URL = "https://m.me/Hudulguunmn";

const carousel = [
  "Тоглож хөгжье",
  "Мэдрэхүй · Тэнцвэр · Хөдөлгөөн",
  "Play based learning tools",
  "Урьдчилсан захиалга эхэллээ",
];

export const Footer = () => {
  const scrollVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  return (
    <footer className="w-full bg-[#1A1A1A] pb-8 sm:pb-[53px]">
      <div className="h-16 sm:h-[84px] bg-gradient-to-r from-[#7B5CF5] via-[#2E9BA8] to-[#1FBF73] flex items-center overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          variants={scrollVariants}
          animate="animate"
        >
          {[...carousel, ...carousel].map((item, i) => (
            <p
              key={`item-${i}`}
              className="font-display text-lg sm:text-2xl font-semibold mr-8 sm:mr-12 text-white"
            >
              {item} <span className="ml-8 sm:ml-12 opacity-60">✦</span>
            </p>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="w-full flex flex-col md:flex-row pt-10 sm:pt-14 justify-between gap-10">
          <div className="flex flex-col text-white gap-3 items-center md:items-start text-center md:text-left">
            <div className="font-display text-xl font-semibold leading-[1.15] tracking-[0.3em]">
              HUDUL
              <br />
              GUUN
            </div>
            <p className="text-xs text-white/60">Play based learning tools</p>
            <p className="mt-2 max-w-xs text-sm text-white/70">
              Хүүхдийн мэдрэхүй, тэнцвэр, хөдөлгөөнийг тоглоомоор хөгжүүлэх хэрэгслүүд.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-16 text-center sm:text-left">
            <nav className="flex flex-col gap-3 text-white" aria-label="Цэс">
              <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Цэс</h2>
              <Link href="/" className="text-sm md:text-base hover:text-white/80">Нүүр</Link>
              <Link href="/#products" className="text-sm md:text-base hover:text-white/80">Бүтээгдэхүүн</Link>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base hover:text-white/80"
              >
                Холбоо барих
              </a>
            </nav>

            <div className="flex flex-col gap-3 items-center sm:items-start">
              <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                Биднийг дагаарай
              </h2>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook хуудас"
                className="flex items-center gap-2 text-sm text-white hover:text-white/80"
              >
                <FacebookIcon />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row text-white/50 gap-2 sm:gap-6 py-6 border-t border-white/15 items-center justify-center sm:justify-between mt-10 sm:mt-14 text-sm">
          <p>© {new Date().getFullYear()} Hudul Guun. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};
