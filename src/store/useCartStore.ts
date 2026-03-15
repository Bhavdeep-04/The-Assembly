import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  getItemByCategory: (category: string) => CartItem | undefined;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const currentItems = get().items;
        const existingCategoryIndex = currentItems.findIndex(item => item.category === product.category);
        
        if (existingCategoryIndex >= 0) {
          // Replace the item in the same category
          const newItems = [...currentItems];
          newItems[existingCategoryIndex] = { ...product, quantity: 1 };
          set({ items: newItems });
        } else {
          // Add new item
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },

      getItemByCategory: (category: string) => {
        return get().items.find(item => item.category === category);
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'assembly-cart-storage',
    }
  )
);
