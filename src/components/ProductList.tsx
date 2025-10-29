import { useProductStore } from '../store/productStore';
import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';

export function ProductList() {
  const products = useProductStore(state => state.products);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Products Yet
        </h3>
        <p className="text-gray-500">
          Add your first product above to start generating creative images
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
