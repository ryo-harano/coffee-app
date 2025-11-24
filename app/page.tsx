"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MenuCard from '@/components/MenuCard';
import CartDrawer from '@/components/CartDrawer';
import AddToCartModal from '@/components/AddToCartModal';
import { useCoffee, MenuItem } from '@/context/CoffeeContext';

export default function Home() {
  const { menuItems, addToCart } = useCoffee();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Modal State
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Drink', 'Food', 'Dessert'];

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCartClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmAddToCart = (size: 'S' | 'M' | 'L', quantity: number, temperature: 'Hot' | 'Ice') => {
    if (selectedItem) {
      addToCart(selectedItem, size, quantity, temperature);
      // setIsCartOpen(true); // Removed auto-open as per request
      // alert('Added to cart!'); // Removed alert as per request
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8f6] pb-20">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        onConfirm={handleConfirmAddToCart}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Our Menu</h1>
          <p className="text-gray-600">Handcrafted beverages to brighten your day</p>
        </header>

        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${activeCategory === category
                ? 'bg-coffee-green text-white shadow-lg scale-105'
                : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} onAdd={handleAddToCartClick} />
          ))}
        </div>

        {/* 割引キャンペーン説明 */}
        <div className="mt-8 p-6 bg-coffee-cream rounded-xl border-2 border-coffee-green">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎉</span>
            <h3 className="text-lg font-bold text-coffee-dark">Special Combo Discount</h3>
          </div>
          <p className="text-coffee-dark">
            Order a beverage with food or dessert and get <span className="font-bold text-coffee-green">10% OFF</span> on your drink!
          </p>
        </div>
      </main>
    </div>
  );
}
