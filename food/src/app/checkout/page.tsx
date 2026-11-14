"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Header } from "../(customer)/_components/Header";
import { Footer } from "../(customer)/_components/Footer";
import { useCart } from "../(customer)/_components/CartContext";
import { useAuth } from "../_providers/AuthProvider";
import { api } from "@/axios";
import { ProductImage } from "@/components/ProductImage";
import { BANK, DISTRICTS, LAST_ORDER_KEY } from "./constants";

const fmt = (n: number) => `${n.toLocaleString("en-US")}₮`;

const schema = z.object({
  name: z.string().trim().min(2, "Нэрээ оруулна уу").max(80),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^[0-9]{8}$/, "8 оронтой утасны дугаар оруулна уу")),
  district: z.string().min(1, "Дүүрэг / байршлаа сонгоно уу"),
  address: z.string().trim().min(5, "Дэлгэрэнгүй хаягаа оруулна уу").max(500),
  note: z.string().trim().max(500).optional(),
});
type FormValues = z.input<typeof schema>;
type ParsedValues = z.output<typeof schema>;

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

const inputCls =
  "h-12 w-full rounded-xl border border-[#1A1A1A]/15 bg-white px-4 text-base outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, hydrated, calculateTotal, clearCart, removeProducts } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  // One key per checkout attempt: a double tap or a retry after a timeout returns the same order.
  const idempotencyKey = useRef<string>("");
  if (!idempotencyKey.current) idempotencyKey.current = newKey();

  const total = Number(calculateTotal());

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues, unknown, ParsedValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", district: "", address: "", note: "" },
  });

  // Prefill from the account, without overwriting what the buyer typed.
  useEffect(() => {
    if (!user) return;
    const u = user as typeof user & { phoneNumber?: string };
    if (!getValues("name") && u.name) setValue("name", u.name);
    if (!getValues("phone") && u.phoneNumber && /^\d{8}$/.test(u.phoneNumber)) setValue("phone", u.phoneNumber);
    if (!getValues("address") && u.address && u.address !== "address not added") setValue("address", u.address);
  }, [user, getValues, setValue]);

  const onSubmit = async (values: ParsedValues) => {
    if (submitting || cartItems.length === 0) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        idempotencyKey: idempotencyKey.current,
        items: cartItems.map((i) => ({ food: i.id, variant: i.variant, quantity: i.quantity })),
        customer: values,
      });
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data.order));
      } catch {
        // storage blocked — the success page falls back to a generic message
      }
      clearCart();
      idempotencyKey.current = newKey();
      router.replace(`/checkout/success?n=${encodeURIComponent(data.order.orderNumber ?? "")}`);
    } catch (error) {
      const res = isAxiosError(error) ? error.response : undefined;
      const msg: string | undefined = res?.data?.message;
      if (res?.status === 409 && Array.isArray(res.data?.missing)) {
        removeProducts(res.data.missing.map(String));
        toast.error("Зарим бүтээгдэхүүн дууссан тул сагснаас хасагдлаа. Шалгаад дахин захиална уу.");
      } else if (res?.status === 400 && msg === "Please choose a variant") {
        if (res.data?.product) removeProducts([String(res.data.product)]);
        toast.error("Өнгөө сонгоогүй бүтээгдэхүүн хасагдлаа. Өнгөө сонгоод дахин нэмнэ үү.");
      } else if (res?.status === 429) {
        toast.error("Хэт олон оролдлого. Хэдэн минутын дараа дахин оролдоно уу.");
      } else if (res?.status === 400) {
        toast.error("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else {
        toast.error("Захиалга илгээж чадсангүй. Интернэтээ шалгаад дахин оролдоно уу.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Захиалга</h1>

        {!hydrated ? (
          <div className="mt-6 h-64 animate-pulse rounded-3xl bg-[#1A1A1A]/5" />
        ) : cartItems.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center">
            <p className="text-[#1A1A1A]/60">Таны сагс хоосон байна.</p>
            <Link
              href="/#products"
              className="mt-4 inline-flex h-11 items-center rounded-full bg-[#1A1A1A] px-6 font-semibold text-white"
            >
              Бүтээгдэхүүн үзэх
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start"
          >
            <section className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold">Хүргэлтийн мэдээлэл</h2>
              {!user && (
                <p className="-mt-2 text-sm text-[#1A1A1A]/60">
                  Бүртгэлгүйгээр захиалах боломжтой.{" "}
                  <Link href="/signin" className="font-semibold text-[#0066CC] hover:underline">
                    Нэвтрэх
                  </Link>
                </p>
              )}

              <Field label="Нэр" error={errors.name?.message}>
                <input {...register("name")} autoComplete="name" className={inputCls} />
              </Field>
              <Field label="Утасны дугаар" error={errors.phone?.message}>
                <input
                  {...register("phone")}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="99112233"
                  maxLength={10}
                  className={inputCls}
                />
              </Field>
              <Field label="Дүүрэг / байршил" error={errors.district?.message}>
                <select {...register("district")} className={inputCls}>
                  <option value="">Сонгох</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Дэлгэрэнгүй хаяг" error={errors.address?.message}>
                <textarea
                  {...register("address")}
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Хороо, байр, орц, давхар, тоот"
                  className={`${inputCls} h-auto py-3`}
                />
              </Field>
              <Field label="Нэмэлт тайлбар (заавал биш)" error={errors.note?.message}>
                <textarea {...register("note")} rows={2} className={`${inputCls} h-auto py-3`} />
              </Field>
            </section>

            <aside className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold">Таны захиалга</h2>
              <ul className="flex flex-col gap-3">
                {cartItems.map((i) => (
                  <li key={i.key} className="flex items-center gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#F4F2EF]">
                      <ProductImage src={i.image} alt={i.foodName} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate font-semibold">{i.foodName}</p>
                      <p className="text-[#1A1A1A]/60">
                        {i.variant ? `${i.variant} · ` : ""}
                        {i.quantity} ш
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{fmt(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-[#1A1A1A]/10 pt-4 text-base">
                <span className="font-bold">Нийт дүн</span>
                <span className="font-display font-bold">{fmt(total)}</span>
              </div>
              <div className="rounded-2xl bg-[#F4F2EF] p-3 text-sm text-[#1A1A1A]/70">
                <p className="font-semibold text-[#1A1A1A]">Төлбөр: Дансаар шилжүүлэх</p>
                {BANK.account
                  ? "Захиалгын дугаараа гүйлгээний утга дээр бичнэ. Дансны мэдээлэл дараагийн алхамд гарна."
                  : "Захиалга өгсний дараа бид тантай холбогдож төлбөрийн мэдээллийг өгнө."}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-full bg-[#1A1A1A] text-base font-semibold text-white transition hover:bg-black disabled:opacity-60"
              >
                {submitting ? "Илгээж байна..." : `Захиалга баталгаажуулах · ${fmt(total)}`}
              </button>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  );
}
