import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Erro ao trocar código por sessão:', error);
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
      }

      if (session) {
        console.log('Sessão criada com sucesso no callback');
        return NextResponse.redirect(`${requestUrl.origin}`);
      }
    }

    return NextResponse.redirect(`${requestUrl.origin}/login`);
  } catch (error) {
    console.error('Erro no callback:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=unknown`);
  }
}