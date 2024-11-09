"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateBoardModal from "@/components/modals/CreateBoardModal";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

export default function BoardsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const router = useRouter();

  const loadBoards = async () => {
    try {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBoards(data || []);
    } catch (error) {
      console.error("Erro ao carregar boards:", error);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const saveBoardName = async (boardId: string) => {
    try {
      const { error } = await supabase
        .from("boards")
        .update({ name: boardName })
        .eq("id", boardId);

      if (error) throw error;

      // Atualizar o nome no estado local
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === boardId ? { ...board, name: boardName } : board
        )
      );

      setEditingBoardId(null); // Sair do modo de edição
    } catch (error) {
      console.error("Erro ao salvar o nome do board:", error);
    }
  };

  const handleNameClick = (boardId: string, currentName: string) => {
    setEditingBoardId(boardId); // Ativa o modo de edição
    setBoardName(currentName); // Preenche o nome atual no campo de entrada
  };

  const handleBlur = (boardId: string) => {
    if (editingBoardId) saveBoardName(boardId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Meus Boards</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Novo Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-600 mb-4">
            Você ainda não tem nenhum board
          </h3>
          <Button onClick={() => setIsModalOpen(true)}>
            Criar meu primeiro board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <Link 
              key={board.id} 
              href={`/boards/${board.id}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
            >
              {editingBoardId === board.id ? (
                <Input
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  onBlur={() => handleBlur(board.id)} // Salva ao perder o foco
                  onKeyPress={(e) => {
                    if (e.key === "Enter") saveBoardName(board.id); // Salva ao pressionar Enter
                  }}
                  autoFocus
                  className="font-semibold text-lg mb-2"
                />
              ) : (
                <h2
                  className="font-semibold text-lg mb-2 cursor-pointer"
                  onClick={() => handleNameClick(board.id, board.name)} // Entra no modo de edição ao clicar
                >
                  {board.name}
                </h2>
              )}

              {board.description && (
                <p className="text-sm text-gray-600 mb-4">{board.description}</p>
              )}
              <div className="text-sm text-gray-500">
                {new Date(board.created_at).toLocaleDateString("pt-BR")}
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateBoardModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          loadBoards();
        }} 
      />
    </div>
  );
}
