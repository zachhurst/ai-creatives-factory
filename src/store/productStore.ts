import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useProductStore = create(
  persist(
    (set, get) => ({
      // State
      products: [],
      
      // Actions
      addProduct: (product) => set((state) => ({
        products: [...state.products, { 
          ...product, 
          id: Date.now(),
          createdAt: new Date().toISOString(),
          creativeAngles: [],
          images: []
        }]
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      clearAllProducts: () => set({ products: [] }),
      
      getProduct: (id) => {
        return get().products.find(p => p.id === id);
      }
    }),
    {
      name: 'ai-creative-factory-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
