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
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload.replace(/_/g, '/').replace(/-/g, '+')));
        const currentTime = Date.now() / 1000;

        if (decodedPayload.exp < currentTime) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, [router]);

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

      const responseData = await response.json();
      localStorage.setItem('token', responseData.token);

      if (mode === 'login') {
        router.push('/dashboard');
      } else {
        toast({
          title: 'Account created successfully!',
          description: 'Please log in with your new account.',
        });
        router.push('/login');
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