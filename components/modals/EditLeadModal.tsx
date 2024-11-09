"use client";

import { useState, useEffect } from "react";
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
import { LeadType } from "@/types";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadType;
  onLeadUpdate: (updatedLead: LeadType) => void;
}

const EditLeadModal = ({ isOpen, onClose, lead, onLeadUpdate }: EditLeadModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: lead.nome,
    telefone: lead.telefone || "",
    descricao: lead.descricao || "",
  });

  useEffect(() => {
    setFormData({
      nome: lead.nome,
      telefone: lead.telefone || "",
      descricao: lead.descricao || "",
    });
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const telefone = formData.telefone.replace(/\D/g, "");

      const { data, error } = await supabase
        .from("leads")
        .update({
          nome: formData.nome,
          telefone,
          descricao: formData.descricao,
        })
        .eq("id", lead.id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        onLeadUpdate(data as LeadType); // Atualiza o lead em tempo real
        onClose(); // Fecha o modal após salvar
      }
    } catch (error) {
      console.error("Erro ao atualizar lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
          <DialogDescription>
            Edite as informações do lead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">Nome</label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="telefone" className="text-sm font-medium">Telefone</label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">Descrição</label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadModal;
