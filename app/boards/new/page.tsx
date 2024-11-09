"use client";

import React, { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { supabase } from "@/lib/supabase";
import { ColumnProps, LeadType } from "@/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropIndicator from "@/components/board/DropIndicator";
import AddLeadModal from "@/components/modals/AddLeadModal";
import LeadCard from "@/components/board/LeadCard";
import { Input } from "@/components/ui/input"; // Importar o componente Input

const Column = ({
  column,
  leads,
  setLeads,
  boardId,
}: ColumnProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.title);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para salvar o novo nome da coluna no banco de dados
  const saveColumnName = async () => {
    try {
      const { error } = await supabase
        .from("columns")
        .update({ title: columnName })
        .eq("id", column.id);

      if (error) throw error;
      setIsEditing(false); // Sair do modo de edição após salvar
    } catch (error) {
      console.error("Erro ao atualizar o nome da coluna:", error);
      alert("Erro ao atualizar o nome da coluna.");
    }
  };

  // Manipulador de tecla Enter e perda de foco
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveColumnName();
    }
  };

  const handleBlur = () => {
    saveColumnName();
  };

  const filteredLeads = leads
    .filter((lead) => lead.column_id === column.id)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="w-[310px] shrink-0">
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <Input
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              onBlur={handleBlur} // Salvar ao perder o foco
              onKeyPress={handleKeyPress} // Salvar ao pressionar Enter
              autoFocus
              className="text-sm font-medium"
            />
          ) : (
            <h3
              className="font-medium text-neutral-700 cursor-pointer"
              onClick={() => setIsEditing(true)} // Ativa o modo de edição ao clicar
            >
              {columnName}
            </h3>
          )}
          <span className="text-sm text-neutral-400">{filteredLeads.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsModalOpen(true)}
            className="text-neutral-500 hover:text-neutral-900"
          >
            <IoAddOutline className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-500 hover:text-neutral-900"
              >
                <BsThreeDots className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Editar Coluna
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Remover Coluna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={cn(
          "h-full w-[310px] p-3 rounded-xl transition-colors bg-neutral-50/50"
        )}
      >
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} {...lead} />
        ))}
        <DropIndicator beforeId={null} column={column.id} />
      </div>

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        boardId={boardId}
        columnId={column.id}
      />
    </div>
  );
};

