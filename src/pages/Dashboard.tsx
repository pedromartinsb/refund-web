import { useState } from "react";

import searchSvg from "../assets/search.svg";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { RefundItem } from "../components/RefundItem";
import { CATEGORIES } from "../utils/categories";

const REFUND_EXAMPLE = {
  id: "1",
  name: "João Silva",
  category: "Alimentação",
  amount: 150.34,
  categoryImg: CATEGORIES["transport"].icon,
};

export function Dashboard() {
  const [name, setName] = useState("");

  function fetchRefunds(e: React.FormEvent) {
    e.preventDefault();

    console.log(name);
  }

  return (
    <div className="bg-gray-500 rounded-xl p-10 md:min-w-3xl">
      <h1 className="text-gray-100 font-bold text-xl flex-1">Solicitações</h1>

      <form
        onSubmit={fetchRefunds}
        className="flex flex-1 items-center justify-between pb-6 border-b border-b-gray-400 md:flex-row gap-2 mt-6"
      >
        <Input
          placeholder="Pesquisar pelo nome"
          onChange={(e) => setName(e.target.value)}
        />

        <Button type="submit" variant="icon">
          <img src={searchSvg} alt="Ícone de pesquisar" className="w-5" />
        </Button>
      </form>

      <div>
        <RefundItem data={REFUND_EXAMPLE} />
      </div>
    </div>
  );
}
