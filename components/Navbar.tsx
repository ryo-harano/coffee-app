"use client";
import Link from 'next/link';
import { Coffee, ShoppingBag, History, Menu } from 'lucide-react';
import { useCoffee } from '@/context/CoffeeContext';

export default function Navbar({ onCartClick }: { onCartClick: () => void }) {
    const { cart, unviewedOrdersCount } = useCoffee();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-coffee-dark text-white shadow-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-wide">
                    <Coffee className="w-6 h-6" />
                    <span>LiT Cafe</span>
                </Link>
                <div className="flex items-center space-x-5">
                    <Link href="/" className="hover:text-coffee-light transition-colors flex flex-col items-center">
                        <Menu className="w-6 h-6 md:w-7 md:h-7" />
                        <span className="text-[10px] md:text-xs mt-0.5">Menu</span>
                    </Link>
                    <Link href="/history" className="hover:text-coffee-light transition-colors flex flex-col items-center relative">
                        <History className="w-6 h-6 md:w-7 md:h-7" />
                        <span className="text-[10px] md:text-xs mt-0.5">History</span>
                        {unviewedOrdersCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                                {unviewedOrdersCount}
                            </span>
                        )}
                    </Link>
                    {/* Admin link hidden from users */}
                    {/* <Link href="/admin" className="hover:text-coffee-light transition-colors flex items-center space-x-1">
                        <Settings className="w-5 h-5" />
                        <span className="hidden sm:inline">Admin</span>
                    </Link> */}
                    <button onClick={onCartClick} className="relative focus:outline-none hover:text-coffee-light transition-colors flex flex-col items-center">
                        <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />
                        <span className="text-[10px] md:text-xs mt-0.5">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
