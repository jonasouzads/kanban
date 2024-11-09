"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBoardModal = ({ isOpen, onClose }: CreateBoardModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Criar o board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .insert({
          name: formData.nome,
          description: formData.descricao,
          user_id: user.id
        })
        .select()
        .single();

      if (boardError) throw boardError;

      // Criar apenas uma coluna inicial
      const initialColumn = [
        { title: "Novos Leads", status: "new" }
      ];

      // Inserir a coluna inicial
      const { error: columnError } = await supabase
        .from('columns')
        .insert(
          initialColumn.map((col, index) => ({
            board_id: board.id,
            title: col.title,
            status: col.status,
            position: index
          }))
        );

      if (columnError) throw columnError;

      router.refresh();
      onClose();
      router.push(`/boards/${board.id}`);
    } catch (error) {
      console.error("Erro ao criar board:", error);
      alert("Erro ao criar board. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do Board</label>
            <Input
              placeholder="Ex: Leads WhatsApp"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              placeholder="Descrição do board..."
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Board"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardModal;
