import { redirect } from "next/navigation";

// / → /ko 리다이렉트 (next-intl middleware가 처리하지만 fallback용)
export default function RootPage() {
  redirect("/ko");
}
