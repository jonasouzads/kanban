// app/api/webhook/wizebot/[token]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    // Extrai dados do body da requisição JSON
    const { first_name, chat_id } = await request.json();
    
    // Valida se o campo "first_name" está presente
    if (!first_name || !chat_id) {
      return NextResponse.json(
        { error: 'Os campos "first_name" e "chat_id" são obrigatórios.' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Busca o board pelo token recebido na URL
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .select('id')
      .eq('webhook_token', params.token)
      .single();

    if (boardError || !board) {
      return NextResponse.json(
        { error: 'Board não encontrado' },
        { status: 404 }
      );
    }

    // Log de depuração (opcional)
    console.log("Board encontrado:", board.id);

    // Busca a primeira coluna do board para inserir o lead
    const { data: column, error: columnError } = await supabase
      .from('columns')
      .select('id')
      .eq('board_id', board.id)
      .order('position')
      .limit(1)
      .single();

    if (columnError || !column) {
      return NextResponse.json(
        { error: 'Coluna não encontrada' },
        { status: 404 }
      );
    }

    // Log de depuração (opcional)
    console.log("Coluna encontrada:", column.id);

    // Insere o novo lead na tabela "leads"
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        board_id: board.id,
        column_id: column.id,
        nome: first_name,        // Usa o campo "first_name" do body da requisição
        telefone: chat_id,        // Usa o "chat_id" como o número de telefone
        chat_id,                  // Usa o campo "chat_id" do body da requisição
        origem: 'whatsapp',       // Define a origem como "whatsapp"
        position: 0               // Define a posição inicial do lead na coluna
      })
      .select()
      .single();

    if (leadError) {
      throw leadError;
    }

    // Retorna o lead criado com sucesso
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar lead' },
      { status: 500 }
    );
  }
}
