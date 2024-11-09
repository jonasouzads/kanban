"use client";

import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { LeadCardProps, LeadType } from "@/types";
import { supabase } from "@/lib/supabase";
import EditLeadModal from "@/components/modals/EditLeadModal";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Importando o ConfirmationDialog

const LeadCard = ({
  id,
  nome,
  telefone,
  descricao,
  origem,
  column_id,
  position,
  created_at,
  board_id,
  onDragStart,
  setLeads,
}: LeadCardProps & { setLeads: (updateFunc: (leads: LeadType[]) => LeadType[]) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); // Controle para o diálogo de confirmação

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (telefone) {
      window.open(
        `https://app.wizebot.com.br/whatsapp/livechat?subscriber_id=${telefone.replace(/\D/g, "")}`,
        "_blank"
      );
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return format(new Date(date), "dd/MM/yy", { locale: ptBR });
  };

  const confirmDeleteLead = async () => {
    setIsConfirmationOpen(false);
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Erro ao deletar lead:", error);
    }
  };

  const handleDelete = () => {
    setIsConfirmationOpen(true); // Abre o modal de confirmação
  };

  const handleUpdateLead = (updatedLead: LeadType) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    setIsEditModalOpen(false); // Fecha o modal após salvar
  };

  return (
    <TooltipProvider>
      <div
        draggable
        onDragStart={(e) =>
          onDragStart(e, {
            id,
            nome,
            telefone,
            descricao,
            origem,
            column_id,
            position,
            created_at,
            board_id,
          })
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex flex-col gap-3 w-full bg-white rounded-xl border border-neutral-200 p-4 cursor-grab active:cursor-grabbing hover:border-neutral-300 transition-colors mb-3"
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-neutral-900">{nome}</h3>
            {telefone && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-green-600 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    {formatPhoneNumber(telefone)}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Abrir WhatsApp</TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className={`${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-900 h-8 w-8"
                >
                  <BsThreeDots className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Editar Lead
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  Excluir Lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {descricao && (
          <p className="text-sm text-neutral-600 line-clamp-2">{descricao}</p>
        )}

        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              origem === "whatsapp"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {origem === "whatsapp" ? "WhatsApp" : "Manual"}
          </span>
          <span className="text-xs text-neutral-400">
            {formatDate(created_at)}
          </span>
        </div>
      </div>

      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={{
          id,
          nome,
          telefone,
          descricao,
          origem,
          column_id,
          position,
          board_id,
          created_at,
        }}
        onLeadUpdate={handleUpdateLead}
      />

      <ConfirmationDialog
        message="Tem certeza que deseja excluir este lead?"
        onConfirm={confirmDeleteLead}
        onCancel={() => setIsConfirmationOpen(false)}
        isOpen={isConfirmationOpen}
      />
    </TooltipProvider>
  );
};

export default LeadCard;
