'use client';

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

  const handleLogout = () => {
    // Supprime le token pour invalider la session
    localStorage.removeItem('token');

    // Affiche une notification de succès
    toast({
      title: 'Déconnexion réussie',
      description: 'Vous avez été déconnecté avec succès.',
    });

    // Redirige l'utilisateur vers la page de connexion
    router.push('/login');
  };

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
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
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 mt-auto"
        aria-label="Déconnexion"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span>Déconnexion</span>
      </button>
    </nav>
  );
}