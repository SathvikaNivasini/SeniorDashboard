import Shell from "@/components/Shell";
import { HubDataProvider } from "@/lib/data-provider";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HubDataProvider>
      <Shell variant="admin">{children}</Shell>
    </HubDataProvider>
  );
}
