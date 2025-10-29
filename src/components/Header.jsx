import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Creative Factory</h1>
              <p className="text-xs text-gray-500">Transform your products into professional ads</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Powered by</p>
              <p className="text-xs text-gray-500">Groq + Fal.ai</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}