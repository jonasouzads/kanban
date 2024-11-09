// components/modals/BoardSettingsModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

interface BoardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
}

const BoardSettingsModal = ({
  isOpen,
  onClose,
  boardId,
  boardName,
}: BoardSettingsModalProps) => {
  const [name, setName] = useState(boardName);
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("boards")
        .update({ name })
        .eq("id", boardId);

      if (error) throw error;
      alert("Nome do board atualizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar board:", error);
      alert("Erro ao atualizar o nome do board.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (confirm("Tem certeza que deseja excluir este board?")) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from("boards")
          .delete()
          .eq("id", boardId);

        if (error) throw error;
        alert("Board excluído com sucesso!");
        onClose(); // Fechar modal após exclusão
      } catch (error) {
        console.error("Erro ao excluir o board:", error);
        alert("Erro ao excluir o board.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurações do Board</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="danger">Perigo</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Board</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do board"
              />
            </div>
            <Button 
              onClick={handleUpdateName} 
              disabled={loading || name === boardName}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </TabsContent>

          <TabsContent value="danger" className="space-y-4 mt-4">
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="text-red-800 font-medium mb-2">Zona de Perigo</h4>
              <p className="text-sm text-red-600 mb-4">
                Estas ações são irreversíveis. Tenha certeza antes de prosseguir.
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeleteBoard}
                disabled={loading}
              >
                {loading ? "Excluindo..." : "Excluir Board"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BoardSettingsModal;
