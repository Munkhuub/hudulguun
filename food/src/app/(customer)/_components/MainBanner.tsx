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
    swatches: [
      "#9FD8F5",
      "#F6DE5A",
      "#F4A7B9",
      "#C4E27A",
      "#C9B3EE",
      "#7FE0E0",
    ],
  },
  {
    key: "bright",
    label: "Тод өнгө",
    image: "/images/mat-bright.png",
    swatches: [
      "#2B8FE0",
      "#F7D21C",
      "#E3262B",
      "#1E9E4A",
      "#7A2FB8",
      "#F26A1B",
    ],
  },
];

const PRE_ORDER_PRICE = 89000;
const REGULAR_PRICE = 99000;
const MESSENGER_URL = "https://m.me/Hudulguunmn";

const formatPrice = (n: number) => `${n.toLocaleString("en-US")}₮`;

export const MainBanner = () => {
  const [active, setActive] = useState<Variant["key"]>("pastel");
  const selectedVariant = VARIANTS.find((v) => v.key === active)!;

  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFA] text-[#1D1D1F] antialiased">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left Column: Product Information */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1 text-xs font-medium text-black/70 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34C759]" />
            Урьдчилсан захиалга
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#1D1D1F] sm:text-5xl lg:text-6xl">
            Мэдрэхүйн матт
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#86868B] sm:text-lg">
            Хүүхдийн мэдрэхүй, тэнцвэр болон хөдөлгөөнийг дэмжих 6 өөр
            гадаргуутай багц.
          </p>

          {/* Pricing */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold tracking-tight text-[#1D1D1F] sm:text-4xl">
              {formatPrice(PRE_ORDER_PRICE)}
            </span>
            <span className="text-lg text-[#86868B] line-through">
              {formatPrice(REGULAR_PRICE)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex items-center gap-4">
            <a
              href="#products"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#000000] px-7 text-sm font-medium text-white transition hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              Захиалах
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center text-sm font-medium text-[#0066CC] hover:underline"
            >
              Messenger-ээр асуух &rarr;
            </a>
          </div>

          {/* Feature highlights */}
          <p className="mt-10 text-xs font-medium tracking-wide text-[#86868B]">
            6 ШИРХЭГ НЭГ БАГЦ &bull; TPE EN71 СТАНДАРТ &bull; ХАЛЬТИРДАГГҮЙ
          </p>
        </div>

        {/* Right Column: Clean Interactive Showcase */}
        <div className="flex flex-col items-center">
          <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-3xl bg-white p-8 shadow-2xl shadow-black/[0.04] border border-black/[0.04]">
            {VARIANTS.map((v) => (
              <Image
                key={v.key}
                src={v.image}
                alt={`Мэдрэхүйн матт — ${v.label}`}
                fill
                priority={v.key === "pastel"}
                sizes="(min-width: 1024px) 440px, 90vw"
                className={`object-contain p-6 transition-all duration-700 ease-out ${
                  active === v.key
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Minimalist Apple Watch Style Variant Switcher */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              {VARIANTS.map((v) => {
                const isSelected = active === v.key;
                return (
                  <button
                    key={v.key}
                    onClick={() => setActive(v.key)}
                    aria-label={v.label}
                    className={`group relative flex h-7 w-7 items-center justify-center rounded-full transition ${
                      isSelected
                        ? "ring-2 ring-[#0066CC] ring-offset-2"
                        : "hover:opacity-80"
                    }`}
                  >
                    <span className="flex h-5 w-5 overflow-hidden rounded-full border border-black/10">
                      {v.swatches.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="h-full w-full"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-[#86868B] font-medium">
              {selectedVariant.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
