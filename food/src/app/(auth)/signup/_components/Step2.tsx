import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
import { StepContext } from "../../StepProvider";
import { useAuth } from "@/app/_providers/AuthProvider";
import { toast } from "sonner";

export type Step2type = {
  handlePrev: () => void;
};

export const schema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Нууц үг хамгийн багадаа 8 тэмдэгт байна" })
      .max(32, { message: "Нууц үг 32-оос ихгүй тэмдэгт байна" })
      .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
        message:
          "Нууц үгэнд том, жижиг үсэг болон тоо орсон байх ёстой",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

export const Step2 = ({ handlePrev }: Step2type) => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();
  const context = useContext(StepContext);

  if (!context) {
    throw new Error("Step1 must be used within a StepProvider");
  }

  const { values, setValues } = context;
  type Step2FormValues = z.infer<typeof schema>;

  const { register, handleSubmit, formState } = useForm<Step2FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      password: values?.password,
      confirmPassword: values?.confirmPassword,
    },
  });
  return (
    <div className="flex gap-12 p-5 w-full h-screen justify-center">
      <form
        className="w-[416px] mt-[246px] lg:ml-20 flex flex-col gap-6"
        onSubmit={handleSubmit(async (data) => {
          const updatedValues = {
            ...values,
            password: data.password,
          };
          setValues(updatedValues);
          try {
            await signUp({ email: values.email, password: data.password });
          } catch {
            toast.error("Бүртгүүлж чадсангүй");
          }
        })}
      >
        <Button variant="outline" size="icon" onClick={() => handlePrev()}>
          <ChevronLeft />
        </Button>

        <div>
          <h3 className="text-2xl font-semibold">Нууц үг үүсгэх</h3>
          <p className="text-[#71717A]">
            Үсэг, тоо агуулсан найдвартай нууц үг үүсгэнэ үү.
          </p>
        </div>
        <div className="passwordBox flex flex-col gap-4">
          <div className="w-full h-9 px-3 py-2 border-[1px] border-[#E4E4E7] rounded-md">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Нууц үг"
              className="h-5 flex items-center text-[14px] w-full border-none"
              {...register("password")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-9 px-3 py-2 border-[1px] border-[#E4E4E7] rounded-md">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Нууц үг давтах"
                className="h-5 flex items-center text-[14px] w-full border-none"
                {...register("confirmPassword")}
              />
            </div>
            {formState.errors.password && (
              <div className="text-[#E14942] text-[14px]">
                {formState.errors.password.message}
              </div>
            )}
            {formState.errors.confirmPassword && (
              <div className="text-[#E14942] text-[14px]">
                {formState.errors.confirmPassword.message}
              </div>
            )}
          </div>

          <div className="flex h-[16px] items-center gap-2">
            <label
              htmlFor="showPassword"
              className="text-sm text-[#71717A] flex items-center h-full"
            >
              <input
                type="checkbox"
                id="showPassword"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShowPassword(e.target.checked)
                }
                className="size-[16px]"
              />
            </label>
            <p>Нууц үг харах</p>
          </div>
        </div>

        <Button
          className={`w-full transition-none hover:bg-black hover:text-white ${
            formState.isValid
              ? "bg-black text-white"
              : "bg-[#d1d1d1] text-black hover:bg-[#d1d1d1] hover:text-black"
          }`}
          type="submit"
        >
          Бүртгүүлэх
        </Button>
        <div className="w-full flex justify-center">
          <div className="flex gap-3">
            <p className="text-[#71717A]">Бүртгэлтэй юу?</p>
            <Link href="/signin" className="text-[#2563EB]">
              Нэвтрэх
            </Link>
          </div>
        </div>
      </form>
      <div className="hidden lg:block h-full w-[856px]">
        <img
          className="h-full"
          src="/images/signUp/signup.png"
          alt=""
        />
      </div>
    </div>
  );
};
