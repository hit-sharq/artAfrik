// Add to Cart Button Component
'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { ArtListingType } from '@/types';
import toast from 'react-hot-toast';
import './AddToCartButton.css';

interface AddToCartButtonProps {
  artwork: ArtListingType;
  variant?: 'default' | 'icon-only' | 'large';
  showQuantity?: boolean;
}

export default function AddToCartButton({
  artwork,
  variant = 'default',
  showQuantity = false,
}: AddToCartButtonProps) {
  const { addItem, getItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const existingItem = getItem(artwork.id);
  const isInCart = !!existingItem;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Add to local cart
      addItem(artwork, quantity);
      
      // Show success toast
      toast.success(
        <div className="toast-success">
          <Check size={20} />
          <span>
            {isInCart 
              ? `Quantity updated to ${existingItem.quantity + quantity}` 
              : `${artwork.title} added to cart!`
            }
          </span>
        </div>,
        {
          icon: '🛒',
          style: {
            background: '#10b981',
            color: 'white',
          },
        }
      );
      
      // Reset quantity
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  if (variant === 'icon-only') {
    return (
      <button
        className="addtocart-btn icon-only"
        onClick={handleAddToCart}
        disabled={isAdding}
        aria-label="Add to cart"
      >
        {isAdding ? (
          <Loader2 size={20} className="spin" />
        ) : (
          <ShoppingCart size={20} />
        )}
      </button>
    );
  }

  if (variant === 'large') {
    return (
      <div className="addtocart-wrapper large">
        {showQuantity && (
          <div className="quantity-selector">
            <button onClick={decrementQuantity} disabled={quantity <= 1}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={incrementQuantity}>+</button>
          </div>
        )}
        <button
          className="addtocart-btn large"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Loader2 size={22} className="spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart size={22} />
              Add to Cart - ${(artwork.price * quantity).toFixed(2)}
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="addtocart-wrapper">
      {showQuantity && (
        <div className="quantity-selector">
          <button onClick={decrementQuantity} disabled={quantity <= 1}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={incrementQuantity}>+</button>
        </div>
      )}
      <button
        className="addtocart-btn"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? (
          <Loader2 size={18} className="spin" />
        ) : (
          <>
            <ShoppingCart size={18} />
            {isInCart ? 'Update Cart' : 'Add to Cart'}
          </>
        )}
      </button>
    </div>
  );
}

