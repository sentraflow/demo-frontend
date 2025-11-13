import React from 'react';
import { Layout } from '@/components/Layout';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to E-Commerce Store
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
