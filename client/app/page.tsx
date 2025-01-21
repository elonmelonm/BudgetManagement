'use client'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wallet, PieChart, Target, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Divisez le token JWT en trois parties
        const [header, payload, signature] = token.split('.');

        // Décodez la partie payload (Base64URL -> Base64 -> JSON)
        const decodedPayload = JSON.parse(atob(payload.replace(/_/g, '/').replace(/-/g, '+')));

        // Vérifier l'expiration du token
        const currentTime = Date.now() / 1000;
        if (decodedPayload.exp < currentTime) {
          // Si le token est expiré, supprimer le token et rediriger vers login
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          // Si le token est valide, rediriger vers le dashboard
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="text-xl font-bold">Budget Master</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        <main className="text-center space-y-16">
          <section className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Take Control of Your{' '}
              <span className="text-primary">Financial Future</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track expenses, set budgets, and achieve your financial goals with our
              comprehensive personal finance management platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Track Expenses</h3>
              <p className="text-muted-foreground">
                Monitor your spending habits with detailed categorization and insights.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Set Goals</h3>
              <p className="text-muted-foreground">
                Create and track financial goals to achieve your dreams faster.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Analyze Trends</h3>
              <p className="text-muted-foreground">
                Visualize your financial data with beautiful charts and reports.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}