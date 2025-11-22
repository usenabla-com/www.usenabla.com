import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect the capabilities.pdf from unauthorized access
  if (request.nextUrl.pathname === "/capabilities.pdf") {
    const isIdentified = request.cookies.get("posthog_identified")?.value === "true";

    if (!isIdentified) {
      // Redirect to home page if not identified
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("request_capabilities", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/capabilities.pdf"],
};
