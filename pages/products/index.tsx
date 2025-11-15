import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/Input';
import { useProducts, useSearchProducts } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth-store';
import { Product } from '@/types';
import { useRouter } from 'next/router';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const { data: allProducts, isLoading: isLoadingAll } = useProducts();
  const { data: searchResults, isLoading: isSearching } = useSearchProducts(searchQuery);
  const addToCart = useAddToCart();

  const products = searchQuery ? searchResults : allProducts;
  const isLoading = searchQuery ? isSearching : isLoadingAll;

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      await addToCart.mutateAsync({
        userId: user!.id,
        data: { productId: product.id, quantity: 1 },
      });
      alert('Product added to cart!');
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </Layout>
  );
}
