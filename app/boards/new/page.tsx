"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NextPage } from 'next'; // Importe o tipo NextPage
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewBoardForm {
  nome: string;
  descricao: string;
}

const NewBoardPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NewBoardForm>({
    nome: "",
    descricao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Criar o board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert({
          name: formData.nome,
          description: formData.descricao
        })
        .select()
        .single();

      if (boardError) throw boardError;

      // Criar colunas padrão
      const defaultColumns = [
        { titulo: "Novos Leads", status: "new" },
        { titulo: "Em Contato", status: "contact" },
        { titulo: "Aguardando", status: "waiting" },
        { titulo: "Convertidos", status: "converted" },
        { titulo: "Perdidos", status: "lost" }
      ];

      const { error: columnsError } = await supabase
        .from('columns')
        .insert(
          defaultColumns.map((col, index) => ({
            board_id: board.id,
            title: col.titulo,
            status: col.status,
            position: index
          }))
        );

      if (columnsError) throw columnsError;

      router.push(`/boards/${board.id}`);
    } catch (error) {
      console.error("Erro ao criar board:", error);
      alert("Erro ao criar board. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Board</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome do Board
            </label>
            <Input
              id="nome"
              placeholder="Ex: Leads WhatsApp"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="descricao"
              placeholder="Descrição do board..."
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Board"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBoardPage;