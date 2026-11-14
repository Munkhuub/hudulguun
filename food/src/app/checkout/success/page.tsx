"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Header } from "../../(customer)/_components/Header";
import { Footer } from "../../(customer)/_components/Footer";
import { BANK, LAST_ORDER_KEY, MESSENGER_URL } from "../constants";

type LastOrder = {
  orderNumber?: string;
  totalPrice?: number;
  phone?: string;
  foodOrderItems?: { quantity: number; variant?: string }[];
};

const fmt = (n: number) => `${n.toLocaleString("en-US")}₮`;

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Хууллаа");
  } catch {
    toast.error("Хуулж чадсангүй");
  }
};

function SuccessContent() {
  const params = useSearchParams();
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const orderNumber = order?.orderNumber || params.get("n") || "";
  const hasBank = BANK.account !== "";

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
      <div className="rounded-3xl bg-white p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto size-14 text-[#1FBF73]" aria-hidden />
        <h1 className="font-display mt-4 text-2xl font-bold">Захиалга хүлээн авлаа!</h1>
        {orderNumber && (
          <p className="mt-2 text-[#1A1A1A]/70">
            Захиалгын дугаар: <span className="font-bold text-[#1A1A1A]">{orderNumber}</span>
          </p>
        )}
        {typeof order?.totalPrice === "number" && (
          <p className="font-display mt-1 text-xl font-bold">{fmt(order.totalPrice)}</p>
        )}

        <div className="mt-6 rounded-2xl bg-[#F4F2EF] p-4 text-left text-sm">
          <p className="font-bold">Төлбөр төлөх</p>
          {hasBank ? (
            <dl className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2">
              {BANK.name && (
                <>
                  <dt className="text-[#1A1A1A]/60">Банк</dt>
                  <dd className="font-semibold">{BANK.name}</dd>
                  <span />
                </>
              )}
              <dt className="text-[#1A1A1A]/60">Данс</dt>
              <dd className="font-semibold">{BANK.account}</dd>
              <CopyBtn text={BANK.account} />
              {BANK.holder && (
                <>
                  <dt className="text-[#1A1A1A]/60">Хүлээн авагч</dt>
                  <dd className="font-semibold">{BANK.holder}</dd>
                  <span />
                </>
              )}
              {orderNumber && (
                <>
                  <dt className="text-[#1A1A1A]/60">Гүйлгээний утга</dt>
                  <dd className="font-semibold">{orderNumber}</dd>
                  <CopyBtn text={orderNumber} />
                </>
              )}
            </dl>
          ) : (
            <p className="mt-1 text-[#1A1A1A]/70">
              Бид таны {order?.phone ? `${order.phone} ` : ""}дугаар руу удахгүй холбогдож төлбөрийн мэдээллийг өгнө.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-full bg-[#0866FF] font-semibold text-white hover:opacity-90"
          >
            Facebook Messenger-ээр холбогдох
          </a>
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-full border border-[#1A1A1A]/15 font-semibold hover:border-[#1A1A1A]/40"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label="Хуулах"
      className="flex size-9 items-center justify-center rounded-full hover:bg-[#1A1A1A]/5"
    >
      <Copy className="size-4" />
    </button>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
