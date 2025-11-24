"use client";
import { useState, useEffect } from 'react';
import { X, Minus, Plus, Flame, Snowflake } from 'lucide-react';
import { MenuItem } from '@/context/CoffeeContext';

type AddToCartModalProps = {
    isOpen: boolean;
    onClose: () => void;
    item: MenuItem | null;
    onConfirm: (size: 'S' | 'M' | 'L', quantity: number, temperature: 'Hot' | 'Ice') => void;
};

export default function AddToCartModal({ isOpen, onClose, item, onConfirm }: AddToCartModalProps) {
    const [size, setSize] = useState<'S' | 'M' | 'L'>('S');
    const [quantity, setQuantity] = useState(1);
    const [temperature, setTemperature] = useState<'Hot' | 'Ice'>('Hot');

    // Reset state when item changes or modal opens
    useEffect(() => {
        if (isOpen && item) {
            // デフォルトサイズを利用可能なサイズの最初のものに設定
            const availableSizes = item.availableSizes || ['S', 'M', 'L'];
            setSize(availableSizes[0]);
            setQuantity(1);
            // Default to first available temperature
            if (item.availableTemperatures && item.availableTemperatures.length > 0) {
                setTemperature(item.availableTemperatures[0]);
            } else {
                setTemperature('Hot');
            }
        }
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const handleConfirm = () => {
        onConfirm(size, quantity, temperature);
        onClose();
    };

    const currentPrice = item.prices[size.toLowerCase() as 's' | 'm' | 'l'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 bg-coffee-dark text-white flex justify-between items-center">
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <button onClick={onClose}><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Temperature Selection */}
                    {item.availableTemperatures && item.availableTemperatures.length > 1 && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Temperature</label>
                            <div className="grid grid-cols-2 gap-3">
                                {item.availableTemperatures.includes('Hot') && (
                                    <button
                                        onClick={() => setTemperature('Hot')}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${temperature === 'Hot'
                                            ? 'border-red-500 bg-red-50 text-red-600'
                                            : 'border-gray-200 text-gray-500 hover:border-red-200'
                                            }`}
                                    >
                                        <Flame className="w-5 h-5" /> Hot
                                    </button>
                                )}
                                {item.availableTemperatures.includes('Ice') && (
                                    <button
                                        onClick={() => setTemperature('Ice')}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${temperature === 'Ice'
                                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                                            : 'border-gray-200 text-gray-500 hover:border-blue-200'
                                            }`}
                                    >
                                        <Snowflake className="w-5 h-5" /> Ice
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Select Size</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['S', 'M', 'L'] as const).map((s) => {
                                const availableSizes = item.availableSizes || ['S', 'M', 'L'];
                                const isAvailable = availableSizes.includes(s);

                                if (!isAvailable) return null;

                                return (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`py-3 rounded-xl border-2 font-bold transition-all ${size === s
                                            ? 'border-coffee-green bg-coffee-cream text-coffee-green'
                                            : 'border-gray-200 text-gray-500 hover:border-coffee-light'
                                            }`}
                                    >
                                        <div className="text-lg">{s}</div>
                                        <div className="text-xs opacity-80">¥{item.prices[s.toLowerCase() as 's' | 'm' | 'l']}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Quantity</label>
                        <div className="flex items-center justify-center space-x-6 bg-gray-50 p-2 rounded-xl">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 bg-white rounded-full shadow-sm text-coffee-dark hover:bg-gray-100 disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-2xl font-bold text-coffee-dark w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 bg-white rounded-full shadow-sm text-coffee-dark hover:bg-gray-100"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Total & Action */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="text-2xl font-bold text-coffee-dark">¥{currentPrice * quantity}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onClose}
                                className="py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="py-3 rounded-full font-bold text-white bg-coffee-green hover:bg-[#004f32] transition-colors shadow-lg"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
