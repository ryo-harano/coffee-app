"use client";
import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCoffee } from '@/context/CoffeeContext';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { cart, removeFromCart, placeOrder } = useCoffee();
    const [nickname, setNickname] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // 割引判定
    const hasBeverage = cart.some(item => item.category === 'Drink');
    const hasFoodOrDessert = cart.some(item => item.category === 'Food' || item.category === 'Dessert');
    const hasDiscount = hasBeverage && hasFoodOrDessert;

    // 合計金額計算
    const originalTotal = cart.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
    let discountedTotal = 0;

    cart.forEach(item => {
        let itemPrice = item.selectedPrice * item.quantity;
        if (hasDiscount && item.category === 'Drink') {
            itemPrice = itemPrice * 0.9; // 10% OFF
        }
        discountedTotal += itemPrice;
    });

    const total = hasDiscount ? Math.round(discountedTotal) : originalTotal;

    // メールアドレスのバリデーション
    const validateEmail = (email: string) => {
        if (!email) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handlePlaceOrder = () => {
        if (customerEmail && !validateEmail(customerEmail)) {
            setEmailError('正しいメールアドレスを入力してください');
            return;
        }

        setEmailError('');
        placeOrder(nickname || undefined, customerEmail || undefined);
        setNickname('');
        setCustomerEmail('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 bg-coffee-dark text-white flex justify-between items-center">
                    <h2 className="text-xl font-bold">Your Order</h2>
                    <button onClick={onClose}><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
                    ) : (
                        <>
                            {cart.map(item => {
                                const isBeverage = item.category === 'Drink';
                                const itemOriginalPrice = item.selectedPrice * item.quantity;
                                const itemDiscountedPrice = hasDiscount && isBeverage
                                    ? Math.round(itemOriginalPrice * 0.9)
                                    : itemOriginalPrice;
                                const itemHasDiscount = hasDiscount && isBeverage;

                                return (
                                    <div key={`${item.id}-${item.size}-${item.temperature}`} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <div>
                                            <h3 className="font-bold text-coffee-dark">{item.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {item.temperature} | Size: {item.size} | ¥{item.selectedPrice} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                {itemHasDiscount ? (
                                                    <>
                                                        <div className="text-xs text-gray-400 line-through">¥{itemOriginalPrice}</div>
                                                        <div className="font-bold text-coffee-green">¥{itemDiscountedPrice}</div>
                                                    </>
                                                ) : (
                                                    <span className="font-bold">¥{itemOriginalPrice}</span>
                                                )}
                                            </div>
                                            <button onClick={() => removeFromCart(item.id, item.size, item.temperature)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {hasDiscount && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700 font-bold">🎉 Combo Discount Applied!</p>
                                    <p className="text-xs text-green-600">10% OFF on beverages</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-coffee-cream">
                    {cart.length > 0 && (
                        <div className="mb-4 space-y-3">
                            <h3 className="text-sm font-bold text-coffee-dark">Customer Information (Optional)</h3>
                            <input
                                type="text"
                                placeholder="Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-green"
                            />
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={customerEmail}
                                    onChange={(e) => {
                                        setCustomerEmail(e.target.value);
                                        setEmailError('');
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-green ${emailError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {emailError && (
                                    <p className="text-xs text-red-500 mt-1">{emailError}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Get notified when your order is ready!
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4 text-xl font-bold text-coffee-dark">
                        <span>Total</span>
                        <div className="text-right">
                            {hasDiscount ? (
                                <>
                                    <div className="text-sm text-gray-400 line-through font-normal">¥{originalTotal}</div>
                                    <div className="text-coffee-green">¥{total}</div>
                                </>
                            ) : (
                                <span>¥{total}</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full bg-coffee-green text-white py-3 rounded-full font-bold hover:bg-[#004f32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
