import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  RAETZER_TOKEN,
  RAETZER_COOKIE,
  isRaetzerGated,
  raetzerGateHtml,
} from "@/lib/raetzer-gate";

export async function middleware(request: NextRequest) {
  // Password gate for the private Raetzer client preview and its hosted site
  // copy. Anything under /clients/raetzer or /raetzer-website requires the
  // access cookie; without it, serve the branded password page (HTTP 401 so no
  // crawler indexes it).
  const path = request.nextUrl.pathname;
  if (isRaetzerGated(path)) {
    const cookie = request.cookies.get(RAETZER_COOKIE)?.value;
    if (cookie !== RAETZER_TOKEN) {
      const showError = request.nextUrl.searchParams.get("rz") === "bad";
      return new NextResponse(raetzerGateHtml(path, showError), {
        status: 401,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
  }

  // If Supabase env vars aren't configured yet, pass through safely
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Env vars not set — block /dashboard but let everything else through.
    // (/leads has its own password gate inside the page, not Supabase auth.)
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    // Refresh session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /dashboard — redirect unauthenticated users to /login
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from /login and /register
    if (
      user &&
      (request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch {
    // Auth check failed — just pass through, don't crash the site
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
