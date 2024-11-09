"use client";

import React, { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { supabase } from "@/lib/supabase";
import { ColumnProps, LeadType } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Importação do modal de confirmação

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DropIndicator from "./DropIndicator";
import AddLeadModal from "@/components/modals/AddLeadModal";
import LeadCard from "./LeadCard";

const Column = ({
  column,
  leads,
  setLeads,
  boardId,
  setColumns,
}: ColumnProps & { setColumns: React.Dispatch<React.SetStateAction<ColumnProps[]>> }) => {
  const [active, setActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setColumnName] = useState(column.title);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, lead: LeadType) => {
    e.dataTransfer.setData("leadId", lead.id);
    e.dataTransfer.setData("sourceColumnId", lead.column_id);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    try {
      const leadId = e.dataTransfer.getData("leadId");
      const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

      setActive(false);
      setIsOver(false);
      clearHighlights();

      if (sourceColumnId === column.id) return;

      const { data: columnLeads } = await supabase
        .from("leads")
        .select("*")
        .eq("column_id", column.id)
        .order("position");

      const newPosition = columnLeads?.length || 0;

      const { error: updateError } = await supabase
        .from("leads")
        .update({
          column_id: column.id,
          position: newPosition,
          board_id: boardId,
        })
        .eq("id", leadId);

      if (updateError) throw updateError;

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                column_id: column.id,
                position: newPosition,
              }
            : lead
        )
      );

      const oldColumnLeads = leads
        .filter((l) => l.column_id === sourceColumnId)
        .sort((a, b) => a.position - b.position);

      const updatePromises = oldColumnLeads.map((lead, index) =>
        supabase.from("leads").update({ position: index }).eq("id", lead.id)
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Erro ao mover lead:", error);
      loadLeads();
    }
  };

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("board_id", boardId)
        .order("position");

      if (error) throw error;
      if (data) setLeads(data);
    } catch (error) {
      console.error("Erro ao recarregar leads:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
    highlightIndicator();
    setActive(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
    clearHighlights();
    setActive(false);
  };

  const highlightIndicator = () => {
    const indicators = document.querySelectorAll(`[data-column="${column.id}"]`);
    indicators.forEach((indicator) => {
      (indicator as HTMLElement).style.opacity = "1";
    });
  };

  const clearHighlights = () => {
    const indicators = document.querySelectorAll(`[data-column="${column.id}"]`);
    indicators.forEach((indicator) => {
      (indicator as HTMLElement).style.opacity = "0";
    });
  };

  const handleDeleteColumn = () => {
    setIsConfirmationOpen(true);
  };

  const confirmDeleteColumn = async () => {
    setIsConfirmationOpen(false);
    try {
      const { error } = await supabase
        .from("columns")
        .delete()
        .eq("id", column.id);

      if (error) throw error;

      setColumns((prev) => prev.filter((col) => col.id !== column.id));
    } catch (error) {
      console.error("Erro ao remover coluna:", error);
    }
  };

  const cancelDeleteColumn = () => {
    setIsConfirmationOpen(false);
  };

  const handleSaveColumnName = async () => {
    try {
      const { error } = await supabase
        .from("columns")
        .update({ title: columnName })
        .eq("id", column.id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar título da coluna:", error);
    }
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
              onBlur={handleSaveColumnName}
              onKeyPress={(e) => e.key === "Enter" && handleSaveColumnName()}
              autoFocus
            />
          ) : (
            <h3
              className="font-medium text-neutral-700 cursor-pointer"
              onClick={() => setIsEditing(true)}
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
              <DropdownMenuItem onClick={() => setIsEditing(true)}>Editar Coluna</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteColumn} className="text-red-600">
                Remover Coluna
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "h-full w-[310px] p-3 rounded-xl transition-colors bg-white",
          active ? "shadow-inner" : ""
        )}
      >
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            {...lead}
            onDragStart={(e) => handleDragStart(e, lead)}
            setLeads={setLeads}
          />
        ))}
        <DropIndicator
          beforeId={null}
          column={column.id}
          className={isOver ? "opacity-100" : "opacity-0"}
        />
      </div>

      <ConfirmationDialog
        message="Tem certeza de que deseja remover esta coluna?"
        onConfirm={confirmDeleteColumn}
        onCancel={cancelDeleteColumn}
        isOpen={isConfirmationOpen}
      />

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        boardId={boardId}
        columnId={column.id}
        onLeadAdd={(newLead: LeadType) => setLeads((prev) => [...prev, newLead])}
      />
    </div>
  );
};

export default Column;
