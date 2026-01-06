import { useActionState } from "react";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { email } from "zod";

export function SignIn() {
  const [state, formAction, isLoading] = useActionState(signIn, {
    email: "",
    password: "",
  });

  function signIn(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    return { email, password };
  }

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <Input
        required
        name="email"
        legend="E-mail"
        type="email"
        placeholder="your@email.com"
        defaultValue={String(state?.email)}
      />

      <Input
        required
        name="password"
        legend="Password"
        type="password"
        placeholder="123456"
        defaultValue={String(state?.password)}
      />

      <Button type="submit" isLoading={isLoading}>
        Sign-in
      </Button>

      <a
        href="/sign-up"
        className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
      >
        Criar Conta
      </a>
    </form>
  );
}
