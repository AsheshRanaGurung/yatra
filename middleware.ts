import { TOKEN_KEY, USER_TYPE_KEY } from "@/services/constants";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  // @ts-ignore
  const token = request.cookies.get(TOKEN_KEY);
  const userType = request.cookies.get(USER_TYPE_KEY);
  // user types
  const isClient = userType && userType.value === "client";
  const isSuperAdmin = userType && userType.value === "superadmin";
  const isHotelAdmin = userType && userType.value === "hoteladmin";
  const isBusAdmin = userType && userType.value === "busadmin";

  // route types
  const isSuperAdminRoutes = url.pathname.includes("/superadmin");
  const isHotelAdminRoutes = url.pathname.includes("/hoteladmin");
  const isBusAdminRoutes = url.pathname.includes("/busadmin");

  // client public pages
  if (token && isClient) {
    if (url.pathname.includes("/login")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (
    url.pathname.includes("/superadmin/login") ||
    url.pathname.includes("/hoteladmin/login") ||
    url.pathname.includes("/busadmin/login")
  ) {
    // login pages
    if (!token) {
      const responseMain = NextResponse.next();
      return responseMain;
    } else {
      if (isSuperAdmin) {
        url.pathname = "/superadmin";
        return NextResponse.redirect(url);
      } else if (isHotelAdmin) {
        url.pathname = "/hoteladmin";
        return NextResponse.redirect(url);
      } else if (isBusAdmin) {
        url.pathname = "/busadmin";
        return NextResponse.redirect(url);
      } else {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  // protect superadmin routes
  if (isSuperAdminRoutes) {
    if (token && isSuperAdmin) {
      const responseMain = NextResponse.next();
      return responseMain;
    } else {
      url.pathname = "/client";
      return NextResponse.rewrite(url);
    }
  }

  // protect hoteladmin routes
  if (isHotelAdminRoutes) {
    if (token && isHotelAdmin) {
      const responseMain = NextResponse.next();
      return responseMain;
    } else {
      url.pathname = "/client";
      return NextResponse.rewrite(url);
    }
  }

  if (isBusAdminRoutes) {
    if (token && isBusAdmin) {
      const responseMain = NextResponse.next();
      return responseMain;
    } else {
      url.pathname = "/client";
      return NextResponse.rewrite(url);
    }
  }

  url.pathname = "/client" + url.pathname;
  return NextResponse.rewrite(url);
}

/*
    middleware gets triggered only in these routes,
    exclude all the routes of assets and chunks
 */
export const config = {
  matcher: [
    // public routes
    // "/",
    // "/login",
    // "/register",
    // "/forgot-password",
    // "/reset-password",
    // "/tour",
    // "/hotels",
    // "/hotels/:path",
    // "/room/:path",
    // "/room/:path/book",
    // "/login",
    // "/register",
    // "/search",
    // "/profile",
    // "/become-partner",
    // "/bus",
    // "/trip:path",
    // "/tour:path",
    // "/bus/create",

    // // superadmin routes
    // "/superadmin",
    // "/superadmin/login",

    // // hoteladmin routes
    // "/hoteladmin",
    // "/hoteladmin/login",
    // "/hoteladmin/hotel/create",
    "/((?!api|_next/static|_next/image|admin/css|admin/img|admin/vendors|admin/js|client/assets|favicon.ico|sw.js).*)",
  ],
};
