import { useProductStore } from '../store/productStore';
import { calculateEstimatedCost } from '../utils/helpers';
import { Package, Image, DollarSign, Sparkles } from 'lucide-react';

export function StatsDashboard() {
  const products = useProductStore(state => state.products);

  const totalProducts = products.length;
  const totalImages = products.reduce((sum, p) => sum + (p.images?.length || 0), 0);
  const totalAngles = products.reduce((sum, p) => sum + (p.creativeAngles?.length || 0), 0);
  
  const estimatedCost = calculateEstimatedCost(totalProducts, 5);

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      colorClass: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Creative Angles',
      value: totalAngles,
      icon: Sparkles,
      colorClass: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Images Generated',
      value: totalImages,
      icon: Image,
      colorClass: 'bg-green-100 text-green-600'
    },
    {
      label: 'Estimated Cost',
      value: `$${estimatedCost.totalCost.toFixed(2)}`,
      icon: DollarSign,
      colorClass: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.colorClass}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
