import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { AuthForm } from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary p-3">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="mt-8">
          <AuthForm mode="login" />
        </div>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}