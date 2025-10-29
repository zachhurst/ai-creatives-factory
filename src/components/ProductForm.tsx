import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useDialog, dialogHelpers } from './ui/DialogProvider';

export function ProductForm() {
  const addProduct = useProductStore(state => state.addProduct);
  const { showAlert } = useDialog();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!productName.trim() || !productDescription.trim()) {
      showAlert(dialogHelpers.validationError('Please fill in both product name and description'));
      return;
    }

    addProduct({
      name: productName,
      description: productDescription
    });

    setProductName('');
    setProductDescription('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Plus size={24} />
        Add New Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Wireless Headphones"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Premium noise-cancelling headphones with 30-hour battery life and studio-quality sound"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </form>
    </div>
  );
}
