'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  Target,
  PieChart,
  Tags,
  User,
  LogOut,
  Menu, // Icône pour le menu
  X, // Icône pour fermer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Catégories', href: '/categories', icon: Tags },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Reccurents', href: '/reccurrences', icon: Receipt },
  { name: 'Objectifs', href: '/goals', icon: Target },
  { name: 'Statistiques', href: '/statistics', icon: PieChart },
  { name: 'Profil', href: '/profile', icon: User },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  // État pour gérer la visibilité de la sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.',
    });
    router.push('/login');
    setIsSidebarOpen(false); // Ferme la sidebar après déconnexion
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Bouton pour ouvrir/fermer la sidebar sur mobile */}
      <button 
        className="md:hidden p-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay pour fermer la sidebar en cliquant à l'extérieur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col gap-2 bg-white shadow-lg transition-transform transform md:relative md:flex md:w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Bouton pour fermer la sidebar en mode mobile */}
        <button
          className="md:hidden self-end p-2"
          onClick={closeSidebar}
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Liens de navigation */}
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar} // Ferme la sidebar après navigation
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Bouton de déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 mt-auto"
          aria-label="Déconnexion"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </>
  );
}
