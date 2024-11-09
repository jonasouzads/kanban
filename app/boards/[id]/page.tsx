import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CustomKanban from "@/components/board/CustomKanban";

export default async function BoardPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/login");
  }

  // Verificar se o usuário tem acesso ao board
  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!board) {
    redirect("/boards");
  }

  return <CustomKanban boardId={params.id} />;
}