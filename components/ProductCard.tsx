import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2 flex-grow line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold text-primary-600">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500">{product.category}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-sm ${
            product.available ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {product.available ? 'In Stock' : 'Out of Stock'}
        </span>
        <span className="text-sm text-gray-500">
          {product.stockQuantity} available
        </span>
      </div>
      <div className="flex space-x-2">
        <Link href={`/products/${product.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        {onAddToCart && product.available && (
          <Button
            onClick={() => onAddToCart(product)}
            className="flex-1"
            disabled={!product.available}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  );
};
