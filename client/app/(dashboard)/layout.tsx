import { Wallet } from 'lucide-react';
import { MainNav } from '@/components/layout/main-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Barre latérale */}
      <div className="w-64 border-r bg-card px-4 py-6">
        <div className="flex items-center gap-2 px-3 mb-8">
          <Wallet className="h-6 w-6" />
          <span className="font-semibold">Budget Master</span>
        </div>
        <MainNav />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        <header className="border-b bg-card px-6 py-4">
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}