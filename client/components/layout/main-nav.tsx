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
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Objectifs', href: '/goals', icon: Target },
  { name: 'Statistiques', href: '/statistics', icon: PieChart },
  { name: 'Catégories', href: '/categories', icon: Tags },
  { name: 'Profil', href: '/profile', icon: User },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Supprime le token pour invalider la session
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de connexion
    router.push('/login');
  };

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 mt-auto"
      >
        <LogOut className="h-4 w-4" />
        Déconnexion
      </button>
    </nav>
  );
}
