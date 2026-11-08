"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useContext, useState, useCallback, useEffect } from "react";
import { StepContext } from "../../StepProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useRouter } from "next/navigation";

export const loginSchema = z.object({
  email: z.string().email("Имэйл хаяг буруу байна"),
  password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт"),
});

export const Login = () => {
  const context = useContext(StepContext);
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, router]);

  if (!context) {
    throw new Error("Login must be used within a StepProvider");
  }

  const { values, setValues } = context;
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: values?.email || "",
      password: values?.password || "",
    },
  });

  const onSubmit = useCallback(
    async (data: { email: string; password: string }) => {
      setIsSubmitting(true);
      const updatedValues = {
        ...values,
        email: data.email,
        password: data.password,
      };
      setValues(updatedValues);

      try {
        await signIn({
          email: data.email,
          password: data.password,
        });
        // The AuthProvider will handle the redirect via the useEffect above
      } catch (error) {
        console.error("Login failed", error);
        setIsSubmitting(false);
      }
    },
    [values, setValues, signIn]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && formState.isValid && !isSubmitting) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen ">
      <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 justify-center">
        <form
          className="max-w-md w-full mx-auto mt-8 lg:mt-0 lg:max-w-[416px] flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        >
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              aria-label="Буцах"
              className="self-start"
            >
              <ChevronLeft />
            </Button>
          </Link>

          <div>
            <h3 className="text-2xl font-semibold">Нэвтрэх</h3>
            <p className="text-muted-foreground">
              Hudul Guun-д тавтай морил. Бүртгэлээрээ нэвтэрнэ үү.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="px-3 py-2 border rounded-md">
                <input
                  type="email"
                  placeholder="Имэйл хаяг"
                  className="w-full text-sm bg-transparent border-none focus:outline-none"
                  {...register("email")}
                  aria-invalid={!!formState.errors.email}
                />
              </div>
              {formState.errors.email && (
                <p className="text-destructive text-sm">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="px-3 py-2 border rounded-md">
                <input
                  type="password"
                  placeholder="Нууц үг"
                  className="w-full text-sm bg-transparent border-none focus:outline-none"
                  {...register("password")}
                  aria-invalid={!!formState.errors.password}
                />
              </div>
              {formState.errors.password && (
                <p className="text-destructive text-sm">
                  {formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            className={`w-full transition-colors ${
              formState.isValid && !isSubmitting
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            type="submit"
            disabled={!formState.isValid || isSubmitting}
            aria-disabled={!formState.isValid || isSubmitting}
          >
            {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Do not have an account?{" "}
            </span>
            <Link href="/signup" className="text-primary hover:underline">
              Бүртгүүлэх
            </Link>
          </div>
        </form>
      </div>

      <div className="hidden lg:block lg:w-1/2">
        <div className="h-full w-full flex items-center justify-center p-8">
          <img
            className="object-contain w-full h-full max-h-[80vh]"
            src="/images/signUp/signup.png"
            alt=""
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
