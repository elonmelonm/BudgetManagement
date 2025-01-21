'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


const authSchema = z.object({
  username: z.string().nonempty('Username is required').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: mode === 'signup' ? '' : undefined,
      email: '',
      password: '',
    },
  });

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
        console.log(currentTime)
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

  const handleSubmit = async (data: AuthFormData) => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      // Si la connexion ou l'inscription est réussie, traiter la réponse du backend
      const responseData = await response.json();

      // Stocker le token dans localStorage
      localStorage.setItem('token', responseData.token);

      // Redirection après le succès de la connexion/inscription
      if (mode === 'login') {
        window.location.href = '/dashboard';
      } else {
        toast({
          title: 'Account created successfully!',
          description: 'Please log in with your new account.',
        });
        window.location.href = '/login';
      }

      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {mode === 'signup' && (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
