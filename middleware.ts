import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  RAETZER_TOKEN,
  RAETZER_COOKIE,
  isRaetzerGated,
  raetzerGateHtml,
} from "@/lib/raetzer-gate";
import {
  APEX_QUOTE_TOKEN,
  APEX_QUOTE_COOKIE,
  APEX_QUOTE_HOME,
  isApexQuoteGated,
  apexQuoteGateHtml,
} from "@/lib/apex-quote-gate";
import { RM_HQ_HOME, isRmHqGated, rmHqReqOk, rmHqGateHtml } from "@/lib/rm-hq-gate";
import { SKINLUX_HQ_HOME, isSkinluxHqGated, skinluxHqReqOk, skinluxHqGateHtml } from "@/lib/skinlux-hq-gate";
import { SKINLUX_STAFF_HOME, isSkinluxStaffGated, skinluxStaffReqOk, skinluxStaffGateHtml } from "@/lib/skinlux-staff-gate";

export async function middleware(request: NextRequest) {
  // Password gate for the private Raetzer client preview and its hosted site
  // copy. Anything under /clients/raetzer or /raetzer-website requires the
  // access cookie; without it, serve the branded password page (HTTP 401 so no
  // crawler indexes it).
  const path = request.nextUrl.pathname;

  // Password gate for Apex Quote, the Apex Gates internal quoting tool. Its
  // prices and margins are private, so every file under the path is gated.
  if (isApexQuoteGated(path)) {
    const cookie = request.cookies.get(APEX_QUOTE_COOKIE)?.value;
    if (cookie !== APEX_QUOTE_TOKEN) {
      const showError = request.nextUrl.searchParams.get("aq") === "bad";
      const next = /\.\w+$/.test(path) ? path : APEX_QUOTE_HOME;
      return new NextResponse(apexQuoteGateHtml(next, showError), {
        status: 401,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
    if (!/\.\w+$/.test(path)) {
      return NextResponse.redirect(new URL(APEX_QUOTE_HOME, request.url));
    }
    return NextResponse.next();
  }

  // Password gate for Revolution HQ, Jim Picot's live GoHighLevel dashboard.
  // It shows real customer data, so every file under the path is gated.
  if (isRmHqGated(path)) {
    if (!(await rmHqReqOk(request))) {
      return new NextResponse(rmHqGateHtml(request.nextUrl.searchParams.get("rm") === "bad"), {
        status: 401,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
    if (!/\.\w+$/.test(path)) {
      return NextResponse.redirect(new URL(RM_HQ_HOME, request.url));
    }
    return NextResponse.next();
  }

  // Password gate for Skinlux HQ, Jellie's live owner app. Real client data
  // from GoHighLevel, so every file under /clients/skinlux/hq is gated.
  // The public sales demo at /clients/skinlux/*.html is not affected.
  if (isSkinluxHqGated(path)) {
    if (!(await skinluxHqReqOk(request))) {
      return new NextResponse(skinluxHqGateHtml(request.nextUrl.searchParams.get("sl") === "bad"), {
        status: 401,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
    if (!/\.\w+$/.test(path)) {
      return NextResponse.redirect(new URL(SKINLUX_HQ_HOME, request.url));
    }
    return NextResponse.next();
  }

  // Password gate for the Skinlux staff app (therapists). Own password,
  // separate from Skinlux HQ; an HQ sign-in also opens it.
  if (isSkinluxStaffGated(path)) {
    if (!(await skinluxStaffReqOk(request))) {
      return new NextResponse(skinluxStaffGateHtml(request.nextUrl.searchParams.get("st") === "bad"), {
        status: 401,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      });
    }
    if (!/\.\w+$/.test(path)) {
      return NextResponse.redirect(new URL(SKINLUX_STAFF_HOME, request.url));
    }
    return NextResponse.next();
  }

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

  // Only the authenticated areas need a Supabase session check/refresh. Every
  // other request (all public pages, API routes, etc.) skips it, which keeps
  // middleware near-free on the bulk of traffic instead of doing a Supabase
  // auth round-trip on every single request. Big Fluid CPU saver.
  const AUTH_PREFIXES = [
    "/dashboard", "/credits", "/command", "/admin", "/leads", "/apps/pro",
    // Client-brand demo sites and portals kept private (login-gated) so client
    // names are not publicly reachable. Raetzer, Apex and TintGard have their
    // own gates above / inside their pages.
    "/clients/progardfilms", "/clients/regal-homes", "/clients/shym-saunas",
  ];
  // Client-brand demo sites that redirect unauthenticated visitors to /login.
  const PRIVATE_CLIENT_PREFIXES = ["/clients/progardfilms", "/clients/regal-homes", "/clients/shym-saunas"];
  const isPrivateClient = PRIVATE_CLIENT_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
  const needsAuth =
    path === "/login" ||
    path === "/register" ||
    AUTH_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
  if (!needsAuth) {
    return NextResponse.next({ request });
  }

  // If Supabase env vars aren't configured yet, pass through safely
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Env vars not set — block /dashboard but let everything else through.
    // (/leads has its own password gate inside the page, not Supabase auth.)
    if (request.nextUrl.pathname.startsWith("/dashboard") || isPrivateClient) {
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
    if (!user && (request.nextUrl.pathname.startsWith("/dashboard") || isPrivateClient)) {
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
