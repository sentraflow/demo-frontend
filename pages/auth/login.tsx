import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLogin } from '@/hooks/use-auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login.mutateAsync({ email, password });
      router.push('/products');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <Button
              type="submit"
              className="w-full"
              isLoading={login.isPending}
            >
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </Layout>
  );
}
