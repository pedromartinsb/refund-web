import { useState } from "react";
import { z, ZodError } from "zod";
import { AxiosError } from "axios";
import { useNavigate } from "react-router";

import { api } from "../services/api";

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

  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const data = signUpFormSchema.parse({
        name,
        email,
        password,
        passwordConfirmation,
      });

      await api.post("/users", data);

      if (
        confirm(
          "User created successfully. Do you want to go to the login page?"
        )
      ) {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return alert(`Validation errors: ${error.issues[0].message}`);
      }

      if (error instanceof AxiosError) {
        return alert(
          `Error: ${error.response?.data.message || "Could not create user."}`
        );
      }

      if (error) alert("An unexpected error occurred. Please try again.");
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
