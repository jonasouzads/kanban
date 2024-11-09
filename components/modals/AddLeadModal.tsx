"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { LeadType } from "@/types"; // Certifique-se de que o tipo LeadType está corretamente importado

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  columnId: string;
  onLeadAdd: (lead: LeadType) => void; // Callback para adicionar o lead
}

const AddLeadModal = ({ isOpen, onClose, boardId, columnId, onLeadAdd }: AddLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    descricao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Formatar telefone para apenas números
      const telefone = formData.telefone.replace(/\D/g, "");

      // Pegar a última posição dos leads na coluna
      const { data: lastLead } = await supabase
        .from("leads")
        .select("position")
        .eq("column_id", columnId)
        .order("position", { ascending: false })
        .limit(1)
        .single();

      const nextPosition = (lastLead?.position || 0) + 1;

      // Adicionar novo lead
      const { data, error } = await supabase
        .from("leads")
        .insert({
          board_id: boardId,
          column_id: columnId,
          nome: formData.nome,
          telefone,
          descricao: formData.descricao,
          origem: "manual",
          position: nextPosition,
        })
        .select()
        .single();

      if (error) throw error;

      // Chame onLeadAdd com o novo lead
      onLeadAdd(data as LeadType);

      // Limpar formulário e fechar modal
      setFormData({ nome: "", telefone: "", descricao: "" });
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar lead:", error);
      alert("Erro ao adicionar lead. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
          <DialogDescription>
            Adicione as informações do novo lead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">Nome</label>
            <Input
              id="nome"
              placeholder="Digite o nome do lead"
              value={formData.nome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nome: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="telefone" className="text-sm font-medium">Telefone</label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  telefone: formatPhone(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">Descrição</label>
            <Textarea
              id="descricao"
              placeholder="Digite uma descrição para o lead"
              value={formData.descricao}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, descricao: e.target.value }))
              }
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
              {loading ? "Adicionando..." : "Adicionar Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
