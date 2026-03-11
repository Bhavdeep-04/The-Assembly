"use client";

import { useState } from "react";
import { Category, products } from "@/data/products";
import { CategoryList } from "@/components/configurator/CategoryList";
import { ProductGrid } from "@/components/configurator/ProductGrid";
import { CartSummary } from "@/components/configurator/CartSummary";

export function BuildInterface() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Motherboard");

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Column: Configurator Options */}
      <div className="flex-1 w-full min-w-0">
        <CategoryList 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <ProductGrid products={filteredProducts} />
      </div>

      {/* Right Column: Cart Summary — sticky only on large screens */}
      <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
        <CartSummary />
      </div>
    </div>
  );

}
