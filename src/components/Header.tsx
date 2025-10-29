import { Wand2, Trash2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useDialog, dialogHelpers } from './ui/DialogProvider';

export function Header() {
  const clearAllProducts = useProductStore(state => state.clearAllProducts);
  const { showConfirm } = useDialog();

  const handleClearAll = async () => {
    const confirmed = await showConfirm(dialogHelpers.confirmDeleteAll());
    if (confirmed) {
      clearAllProducts();
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wand2 size={40} />
            <div>
              <h1 className="text-3xl font-bold">AI Creative Factory</h1>
              <p className="text-purple-100 text-sm mt-1">
                Powered by Groq + Fal.ai • Replicating n8n Workflow
              </p>
            </div>
          </div>
          <button
            onClick={handleClearAll}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      </div>
    </header>
  );
}
