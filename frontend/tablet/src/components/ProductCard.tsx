import { ProductDTO } from "../types/api";
import { useCartStore } from "../stores/cartStore";
import Badge from "./Badge";
import { useState } from "react";

interface ProductCardProps {
  product: ProductDTO;
}

/**
 * ProductCard Component (POS Enhanced)
 * - Click entire card to add
 * - No description for compactness
 * - Visual feedback on click
 */
export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isClicked, setIsClicked] = useState(false);

  const handleAddToCart = () => {
    if (!product.available) return;

    // Visual feedback
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
    });
  };

  return (
    <div
      onClick={handleAddToCart}
      className={`
        pos-card relative cursor-pointer select-none transition-transform duration-100
        ${isClicked ? "scale-95 ring-2 ring-brand-400" : "hover:shadow-elevated"}
        ${!product.available ? "opacity-60 grayscale cursor-not-allowed" : ""}
      `}
    >
      {/* Click Feedback Overlay */}
      {isClicked && (
        <div className="absolute inset-0 bg-brand-500/10 z-10 animate-flash pointer-events-none" />
      )}

      {/* Product Image */}
      <div className="h-32 w-full bg-sand-100 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: product.imageUrl
              ? `url(${product.imageUrl})`
              : "url(https://images.unsplash.com/photo-1550507992-06d7af535d7a?q=80&w=300&auto=format&fit=crop)",
          }}
        />
        {/* Status Badge */}
        {!product.available && (
          <div className="absolute top-2 right-2">
            <Badge variant="soldout">已售完</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-ink-900 text-lg leading-tight mb-1 truncate">
          {product.name}
        </h3>
        <span className="text-xl font-semibold text-brand-600">
          NT$ {product.price}
        </span>
      </div>
    </div>
  );
}
