"use client";

import Image from "next/image";
import { useState } from "react";

type Variant = {
  key: "pastel" | "bright";
  label: string;
  image: string;
  swatches: string[];
};

const VARIANTS: Variant[] = [
  {
    key: "pastel",
    label: "Бүдэг өнгө",
    image: "/images/mat-pastel.png",
    swatches: ["#9FD8F5", "#F4A7B9", "#C9B3EE"],
  },
  {
    key: "bright",
    label: "Тод өнгө",
    image: "/images/mat-bright.png",
    swatches: ["#2B8FE0", "#E3262B", "#1E9E4A"],
  },
];

const PRE_ORDER_PRICE = 89000;
const REGULAR_PRICE = 99000;
const MESSENGER_URL = "https://m.me/Hudulguunmn";

const formatPrice = (n: number) => `${n.toLocaleString("en-US")}₮`;

export const MainBanner = () => {
  const [active, setActive] = useState<Variant["key"]>("pastel");

  return (
    <section className="w-full overflow-hidden text-[#1A1A1A]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Text */}
        <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-sm font-semibold text-[#C2410C] sm:text-base">
            Урьдчилсан захиалга эхэллээ
          </p>

          <h1 className="mt-2 text-[2.75rem] leading-[1.05] font-bold tracking-tight sm:text-6xl xl:text-7xl">
            Мэдрэхүйн матт
          </h1>

          <p className="mt-3 text-xl font-medium text-[#1A1A1A]/70 sm:text-2xl">
            Мэдрэхүй. Тэнцвэр. Хөдөлгөөн.
          </p>

          <p className="mt-5 text-base text-[#1A1A1A]/70 sm:text-lg">
            {formatPrice(PRE_ORDER_PRICE)}{" "}
            <span className="text-[#1A1A1A]/40 line-through">{formatPrice(REGULAR_PRICE)}</span>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
            <a
              href="#products"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#1A1A1A] px-7 text-base font-semibold text-white transition hover:bg-black focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Захиалах
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center text-base font-semibold text-[#0066CC] hover:underline"
            >
              Messenger-ээр асуух ›
            </a>
          </div>

          <p className="mt-8 text-sm text-[#1A1A1A]/50">
            6 ширхэг нэг багц · TPE, EN71 стандарт · Хальтирдаггүй
          </p>
        </div>

        {/* Image + colour switch */}
        <div className="flex min-w-0 flex-col items-center">
          <div className="relative aspect-[25/21] w-full max-w-xl overflow-hidden rounded-[2rem] bg-white">
            {VARIANTS.map((v) => (
              <Image
                key={v.key}
                src={v.image}
                alt={`Мэдрэхүйн матт — ${v.label}`}
                fill
                priority={v.key === "pastel"}
                sizes="(min-width: 1024px) 560px, 100vw"
                className={`object-cover transition-opacity duration-500 ${
                  active === v.key ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              />
            ))}
          </div>

          <div role="radiogroup" aria-label="Өнгө сонгох" className="mt-6 flex gap-2">
            {VARIANTS.map((v) => {
              const selected = active === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setActive(v.key)}
                  className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                    selected
                      ? "bg-white text-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]"
                      : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <span className="flex -space-x-1" aria-hidden>
                    {v.swatches.map((c) => (
                      <span
                        key={c}
                        className="h-3.5 w-3.5 rounded-full ring-2 ring-[#F4F2EF]"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </span>
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
