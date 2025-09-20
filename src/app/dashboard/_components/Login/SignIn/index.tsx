"use client";

import Button from "@/app/dashboard/_components/Button";
import Field from "@/app/dashboard/_components/Field";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

type SignInProps = {
  handleSignUp: () => void;
  handleForgotPassword: () => void;
};

const SignIn = ({ handleSignUp, handleForgotPassword }: SignInProps) => {
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
    }): Promise<{
      ok: boolean;
      message: string;
      data: { exp: number; token: string };
    }> => {
      return axiosInstance.post(ROUTES.login_action, data);
    },
  });

  // --- form validate
  const schema = z.object({
    email: z.email({ message: "Please enter a valid email address." }),
    password: z.string().min(1, { message: "Please enter password." }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const resp = await loginMutation.mutateAsync(data);
      if (resp.ok && !!resp.data.token) {
        toast.success(resp.message);
        router.replace(ROUTES.dashboard);
      } else {
        toast.error(resp.message);
        return false;
      }
    } catch (err: any) {
      toast.error(err?.toString());
      return false;
    }
  };

  return (
    <>
      <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <Field
          className="mt-6"
          innerLabel="Email"
          placeholder="Enter email"
          type="email"
          {...register("email")}
          errorMessage={errors?.email?.message}
        />
        <Field
          className="mt-6"
          innerLabel="Password"
          placeholder="Enter password"
          type="password"
          {...register("password")}
          errorMessage={errors?.password?.message}
          handleForgotPassword={() => {
            toast.warning("Coming soon!");
            // handleForgotPassword();
          }}
        />
        <Button type="submit" className="mt-6 w-full" isBlack>
          Sign in
        </Button>
      </form>
      {/*<div className="mt-4 text-center text-body-2 text-t-secondary">*/}
      {/*  Need an account?&nbsp;*/}
      {/*  <button*/}
      {/*    type="button"*/}
      {/*    className="text-t-primary font-bold transition-colors hover:text-primary-01"*/}
      {/*    onClick={handleSignUp}*/}
      {/*  >*/}
      {/*    Sign up*/}
      {/*  </button>*/}
      {/*</div>*/}
    </>
  );
};

export default SignIn;
