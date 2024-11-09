"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IoAddOutline } from "react-icons/io5";
import { ColumnType, LeadType } from "@/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import AddSectionModal from "@/components/modals/AddSectionModal";
import Column from "./Column";

const Board = ({ boardId, searchTerm }: { boardId: string; searchTerm: string }) => {
  const [leads, setLeads] = useState<LeadType[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("board_id", boardId)
        .order("position");

      if (error) throw error;
      if (data) setLeads(data);
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
    }
  }, [boardId]);

  const loadBoardData = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: columnsData, error: columnsError } = await supabase
        .from("columns")
        .select("*")
        .eq("board_id", boardId)
        .order("position");

      if (columnsError) throw columnsError;

      setColumns(columnsData);
      await loadLeads();
    } catch (error) {
      console.error("Erro ao carregar board:", error);
    } finally {
      setIsLoading(false);
    }
  }, [boardId, loadLeads]);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  // Assinatura em tempo real para novos leads
  useEffect(() => {
    const channel = supabase
      .channel("realtime:leads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const newLead = payload.new as LeadType;
          if (newLead.board_id === boardId) {
            setLeads((prevLeads) => {
              if (prevLeads.find((lead) => lead.id === newLead.id)) {
                return prevLeads; // Evita duplicação
              }
              return [...prevLeads, newLead];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId]);

  // Filtra os leads pelo searchTerm
  const filteredLeads = leads.filter((lead) =>
  typeof lead.nome === "string" &&
  lead.nome.toLowerCase().includes(searchTerm?.toLowerCase() || "")
);

  const handleAddColumn = async (title: string) => {
    try {
      const { data: newColumn, error } = await supabase
        .from("columns")
        .insert({
          board_id: boardId,
          title,
          status: title.toLowerCase(),
          position: columns.length,
        })
        .select()
        .single();

      if (error) throw error;

      setColumns((prev) => [...prev, newColumn]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar coluna:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-lg">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-6">
      <div className="flex-1 overflow-x-auto hide-scrollbar">
        <div className="flex gap-6 min-w-fit pb-6">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              leads={filteredLeads.filter((lead) => lead.column_id === column.id)}
              setLeads={setLeads}
              boardId={boardId}
              setColumns={setColumns}
            />
          ))}

          <div className="shrink-0 w-[310px] pt-2">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-gray-900 w-full justify-start gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <IoAddOutline className="h-5 w-5" />
              <span className="font-medium">Adicionar Seção</span>
            </Button>
          </div>
        </div>
      </div>

      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddColumn}
      />
    </div>
  );
};

export default Board;
