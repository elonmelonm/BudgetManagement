import { Wallet } from 'lucide-react';
import { MainNav } from '@/components/layout/main-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex left-0 min-h-screen">
      {/* Barre latérale */}
      <div className="lg:w-72 md:w-48 border-r bg-card px-4 py-6">
        <div className="items-center gap-2 px-3 mb-8 hidden md:flex">
          <Wallet className="h-6 w-6" />
          <span className="font-semibold">Budget Master</span>
        </div>
        <MainNav />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        <header className="-mt-14 md:mt-0 border-b bg-card px-6 py-4">
          <h1 className="absolute z-10 ml-9 -mt-5 md:mt-0 md:ml-0 md:relative text-2xl font-semibold">Tableau de bord</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}