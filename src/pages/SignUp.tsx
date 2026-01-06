import { useState } from "react";
import { set, z, ZodError } from "zod";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

const signUpFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    passwordConfirmation: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const data = signUpFormSchema.parse({
        name,
        email,
        password,
        passwordConfirmation,
      });

      console.log("Form data is valid:", data);
    } catch (error) {
      if (error instanceof ZodError) {
        return alert(`Validation errors: ${error.issues[0].message}`);
      }

      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
      <Input
        required
        legend="Name"
        placeholder="your@email.com"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        required
        legend="E-mail"
        type="email"
        placeholder="your@email.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        required
        legend="Password"
        type="password"
        placeholder="123456"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        required
        legend="Confirm Password"
        type="password"
        placeholder="123456"
        onChange={(e) => setPasswordConfirmation(e.target.value)}
      />

      <Button type="submit" isLoading={isLoading}>
        Cadastrar
      </Button>

      <a
        href="/sign-up"
        className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
      >
        Já tenho uma Conta
      </a>
    </form>
  );
}
