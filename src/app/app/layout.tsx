import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BottomNav } from "@/components/shell/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-screen-sm">{children}</div>
      <BottomNav />
    </div>
  );
}
