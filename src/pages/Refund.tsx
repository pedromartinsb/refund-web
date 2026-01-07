import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { api } from "../services/api";
import fileSvg from "../assets/file.svg";
import { CATEGORIES, CATEGORIES_KEY } from "../utils/categories";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Upload } from "../components/Upload";
import { Button } from "../components/Button";
import z from "zod";
import { AxiosError } from "axios";

const refundSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  amount: z.coerce.number().positive("O valor deve ser positivo"),
  category: z.enum(CATEGORIES_KEY),
});

export function Refund() {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (params.id) {
      return navigate(-1);
    }

    try {
      setIsLoading(true);

      if (!file) {
        alert("Por favor, envie um comprovante.");
        return;
      }

      const fileFormData = new FormData();
      fileFormData.append("file", file);

      const fileUploadResponse = await api.post("/upload", fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = refundSchema.parse({
        name,
        amount: parseFloat(amount.replace(",", ".")),
        category,
      });

      await api.post("/refunds", {
        ...data,
        filename: fileUploadResponse.data.filename,
      });

      navigate("/confirm", {
        state: { fromSubmit: true },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.issues[0].message);
      }

      if (error instanceof AxiosError) {
        alert(error.response?.data.message || "Erro na solicitação.");
      }

      alert("Erro ao enviar solicitação de reembolso.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-lg"
    >
      <header>
        <h1 className="text-xl font-bold text-gray-100">
          Solicitação de reembolso
        </h1>

        <p className="text-xs text-gray-200 mt-2 mb-4">
          Dados da despesa para solicitar reembolso.
        </p>
      </header>

      <Input
        required
        legend="Nome da Solicitação"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={!!params.id}
      />

      <div className="flex gap-4">
        <Select
          required
          legend="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!!params.id}
        >
          {CATEGORIES_KEY.map((category) => (
            <option key={category} value={category}>
              {CATEGORIES[category].name}
            </option>
          ))}
        </Select>

        <Input
          legend="valor"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={!!params.id}
        />
      </div>

      {params.id ? (
        <a
          href="/"
          target="_blank"
          className="text-sm text-green-100 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
        >
          <img src={fileSvg} alt="Ícone de arquivo" />
          Abrir comprovante
        </a>
      ) : (
        <Upload
          filename={file && file.name}
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      )}

      <Button type="submit" isLoading={isLoading}>
        {params.id ? "Atualizar Solicitação" : "Enviar Solicitação"}
      </Button>
    </form>
  );
}
