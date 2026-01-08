import { useActionState } from "react";

import { api } from "../services/api";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useAuth } from "../hooks/useAuth";

const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function SignIn() {
  const [state, formAction, isLoading] = useActionState(signIn, null);

  const auth = useAuth();

  async function signIn(_: any, formData: FormData) {
    try {
      const data = signInSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const response = await api.post("/sessions", data);
      auth.save(response.data);
    } catch (error) {
      console.error("Validation error:", error);

      if (error instanceof ZodError) {
        return { message: error.issues[0].message };
      }

      if (error instanceof AxiosError) {
        if (error.response) {
          return { message: error.response.data.message || "Sign-in failed." };
        } else {
          return { message: "Network error. Please try again." };
        }
      }

      return { message: "An unexpected error occurred." };
    }
  }

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        required
        name="email"
        legend="E-mail"
        type="email"
        placeholder="your@email.com"
      />

      <Input
        required
        name="password"
        legend="Password"
        type="password"
        placeholder="123456"
      />

      <p
        className="text-sm text-red-600 text-center my-4 font-medium"
        hidden={!state?.message}
      >
        {state?.message}
      </p>

      <Button type="submit" isLoading={isLoading}>
        Sign-in
      </Button>

      <a
        href="/sign-up"
        className="text-sm font-semibold text-gray-100 my-4 text-center hover:text-green-800 transition ease-linear"
      >
        Create Account
      </a>
    </form>
  );
}
