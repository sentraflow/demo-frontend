import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/router';
import { useProduct } from '@/hooks/use-products';
import { useAddToCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/store/auth-store';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [quantity, setQuantity] = useState(1);
  const { user, isAuthenticated } = useAuthStore();

  const { data: product, isLoading } = useProduct(Number(id));
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      await addToCart.mutateAsync({
        userId: user!.id,
        data: { productId: product!.id, quantity },
      });
      alert('Product added to cart!');
      router.push('/cart');
    } catch (error: any) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-600">Product not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        ← Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 text-xl">No Image</span>
          )}
        </div>

        <Card>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-primary-600 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="mb-4">
            <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Availability:{' '}
              <span
                className={
                  product.available ? 'text-green-600' : 'text-red-600'
                }
              >
                {product.available ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              {product.stockQuantity} units available
            </p>
          </div>

          {product.available && (
            <>
              <div className="mb-4">
                <Input
                  type="number"
                  label="Quantity"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <Button
                onClick={handleAddToCart}
                className="w-full"
                isLoading={addToCart.isPending}
                disabled={!product.available}
              >
                Add to Cart
              </Button>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
