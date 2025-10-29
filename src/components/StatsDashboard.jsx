import { useProductStore } from '../store/productStore';
import { calculateEstimatedCost } from '../utils/helpers';
import { Package, Image, DollarSign, Sparkles, Upload, Eye } from 'lucide-react';

export function StatsDashboard() {
  const products = useProductStore(state => state.products);

  const totalProducts = products.length;
  const totalImages = products.reduce((sum, p) => sum + (p.images?.length || 0), 0);
  const totalAngles = products.reduce((sum, p) => sum + (p.creativeAngles?.length || 0), 0);
  const totalReferenceImages = products.reduce((sum, p) => sum + (p.referenceImages?.length || 0), 0);
  
  const productsWithReferenceImages = products.filter(p => p.referenceImages && p.referenceImages.length > 0).length;
  const productsGenerated = products.filter(p => p.images && p.images.length > 0).length;
  
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

  const secondaryStats = [
    {
      label: 'Reference Images',
      value: totalReferenceImages,
      icon: Upload,
      colorClass: 'bg-indigo-100 text-indigo-600'
    },
    {
      label: 'Products with References',
      value: `${productsWithReferenceImages}/${totalProducts}`,
      icon: Eye,
      colorClass: 'bg-pink-100 text-pink-600'
    },
    {
      label: 'Products Generated',
      value: `${productsGenerated}/${totalProducts}`,
      icon: Image,
      colorClass: 'bg-teal-100 text-teal-600'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.colorClass}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Insights */}
      {totalProducts > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Usage Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-600">Reference Image Usage</p>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalProducts > 0 ? (productsWithReferenceImages / totalProducts) * 100 : 0}%` }}
                />
              </div>
              <p className="text-gray-500 mt-1">
                {totalProducts > 0 ? Math.round((productsWithReferenceImages / totalProducts) * 100) : 0}% of products use reference images
              </p>
            </div>
            <div>
              <p className="text-gray-600">Generation Completion</p>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalProducts > 0 ? (productsGenerated / totalProducts) * 100 : 0}%` }}
                />
              </div>
              <p className="text-gray-500 mt-1">
                {totalProducts > 0 ? Math.round((productsGenerated / totalProducts) * 100) : 0}% of products have generated images
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}