import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { ImageUploadTest } from './components/ImageUploadTest';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <StatsDashboard />
        <ProductForm />
        <ProductList />
        
        {/* Development Testing Section */}
        {import.meta.env.DEV && (
          <div className="mt-8">
            <ImageUploadTest />
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p className="font-medium">AI Creative Factory • React + Vite + Zustand + Groq + Fal.ai</p>
          <p className="mt-1 text-xs text-gray-500">
            Cost: ~$0.20 per product (5 images) • Data stored locally in your browser
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Engineered prompts for professional ad creatives • Square format (1:1) for social media
          </p>
          <p className="mt-1 text-xs text-blue-600">
            🆕 New: Reference image upload support • Transform your product photos into professional ads
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App
