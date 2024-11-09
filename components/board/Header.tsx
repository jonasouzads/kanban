// components/Header.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { IoIosSettings } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BoardSettingsModal from "@/components/modals/BoardSettingsModal";
import WebhookModal from "@/components/modals/WebhookModal";

const Header = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [boardName, setBoardName] = useState("");
  const [webhookToken, setWebhookToken] = useState("");
  const [boardId, setBoardId] = useState("");

  // Modais
  const [isBoardSettingsOpen, setIsBoardSettingsOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  // Novo estado para o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBoardData = async () => {
      const boardMatch = pathname.match(/\/boards\/([^\/]+)/);
      if (boardMatch && boardMatch[1]) {
        const currentBoardId = boardMatch[1];
        setBoardId(currentBoardId);

        const { data, error } = await supabase
          .from("boards")
          .select("name, webhook_token")
          .eq("id", currentBoardId)
          .single();

        if (!error && data) {
          setBoardName(data.name);
          setWebhookToken(data.webhook_token);
        }
      } else {
        setBoardName("");
        setWebhookToken("");
        setBoardId("");
      }
    };

    loadBoardData();
  }, [pathname]);

  const isBoard = pathname.includes("/boards/");

  // Atualiza o termo de pesquisa e passa para o componente pai
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Passa o termo de pesquisa para o componente pai
  };

  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center h-24 px-8">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-8">
            {isBoard && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => router.back()}
              >
                <FiArrowLeft size={20} />
              </Button>
            )}

            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <Image
                  src="/logo.png"
                  alt="Wizebot"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 400px, (max-width: 1200px) 200px, 400px"
                />
              </div>
              {isBoard && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-gray-800">
                    {boardName}
                  </span>
                  <span className="text-sm text-gray-500 hidden md:inline">
                    • Board
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-6">
            {isBoard && (
              <div className="relative w-80">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Pesquisar leads..."
                  value={searchTerm}
                  onChange={handleSearchChange} // Atualiza o termo de pesquisa
                  className="pl-10 h-10 bg-gray-50 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <IoIosSettings size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isBoard ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsBoardSettingsOpen(true)}>
                      Configurações do Board
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsWebhookOpen(true)}>
                      Configurar Webhook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsMembersOpen(true)}>
                      Gerenciar Membros
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Excluir Board
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>Configurações</DropdownMenuItem>
                    <DropdownMenuItem>Minha Conta</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Sair
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Modais */}
      {isBoard && boardId && (
        <>
          <BoardSettingsModal
            isOpen={isBoardSettingsOpen}
            onClose={() => setIsBoardSettingsOpen(false)}
            boardId={boardId}
            boardName={boardName}
          />
          <WebhookModal
            isOpen={isWebhookOpen}
            onClose={() => setIsWebhookOpen(false)}
            boardId={boardId}
            webhookToken={webhookToken}
          />
        </>
      )}
    </header>
  );
};

export default Header;
