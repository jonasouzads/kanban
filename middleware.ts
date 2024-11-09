import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('URL atual:', request.nextUrl.pathname);
    console.log('Sessão existe?', !!session);
    console.log('Detalhes da sessão:', session ? 'Sessão válida' : 'Sem sessão');

    // Rotas públicas (não precisam de autenticação)
    const publicRoutes = ['/login', '/signup', '/auth/callback'];
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    );

    // Se não estiver autenticado e tentar acessar uma rota protegida
    if (!session && !isPublicRoute) {
      console.log('Redirecionando para /login (sem sessão)');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se estiver autenticado e tentar acessar rotas públicas
    if (session && isPublicRoute) {
      console.log('Redirecionando para / (com sessão)');
      return NextResponse.redirect(new URL('/', request.url));
    }

    return res;
  } catch (error) {
    console.error('Erro no middleware:', error);
    // Em caso de erro, redireciona para login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico)$).*)'],
}