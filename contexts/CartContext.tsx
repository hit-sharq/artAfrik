// Shopping Cart Context using Zustand
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItemType, ArtListingType } from '@/types';

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (artwork: ArtListingType, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getItem: (artListingId: string) => CartItemType | undefined;
}

// Create the store with persistence
const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (artwork, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.artListingId === artwork.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.artListingId === artwork.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItemType = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            cartId: '',
            artListingId: artwork.id,
            quantity,
            artListing: artwork,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.artListing?.price || 0) * item.quantity,
          0
        );
      },

      getItem: (artListingId) => {
        return get().items.find((item) => item.artListingId === artListingId);
      },
    }),
    {
      name: 'artafrik-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// Export a hook for using cart in components
export function useCart() {
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const itemCount = useCartStore((state) => state.getItemCount());
  const subtotal = useCartStore((state) => state.getSubtotal());
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getItem = useCartStore((state) => state.getItem);

  return {
    items,
    isOpen,
    itemCount,
    subtotal,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
  };
}

// Export the store for advanced use cases
export { useCartStore };
export type { CartState };

