import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // '/' 는 locale 리다이렉트 처리
    "/",
    // /(ko|zh)/... 경로
    "/(ko|zh)/:path*",
    // api, _next, 정적 파일 제외
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
