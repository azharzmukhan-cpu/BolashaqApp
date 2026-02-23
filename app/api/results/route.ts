import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies(); // Добавляем await для новых версий Next.js

  // Создаем клиент по новому стандарту @supabase/ssr
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Игнорируем, если вызывается из Server Component
          }
        },
      },
    }
  );

  // Проверяем сессию
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('quiz_results')
      .insert([{
        user_id: session.user.id,
        category: body.category,
        title: body.title,
        analysis: body.analysis || body.skill,
        dream_uni: body.uniList?.dream,
        match_uni: body.uniList?.match,
        safety_uni: body.uniList?.safety
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}