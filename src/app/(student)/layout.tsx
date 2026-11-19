import Shell from "@/components/Shell";
import { HubDataProvider } from "@/lib/data-provider";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HubDataProvider>
      <Shell variant="student">{children}</Shell>
    </HubDataProvider>
  );
}
