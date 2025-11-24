"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { useCoffee } from '@/context/CoffeeContext';
import { Clock, Calendar, ShoppingBag } from 'lucide-react';

export default function HistoryPage() {
    const { orders, markOrdersAsViewed } = useCoffee();
    const [isCartOpen, setIsCartOpen] = useState(false);

    // ページを開いたら注文を既読にする（初回のみ）
    useEffect(() => {
        markOrdersAsViewed();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Calculate pickup time: Order time + 10 mins, rounded up to nearest 5 mins
    const calculatePickupTime = (orderDateStr: string) => {
        const orderDate = new Date(orderDateStr);
        const tenMinutesLater = new Date(orderDate.getTime() + 10 * 60000);
        const minutes = tenMinutesLater.getMinutes();
        const remainder = minutes % 5;

        if (remainder !== 0) {
            tenMinutesLater.setMinutes(minutes + (5 - remainder));
        }
        // Reset seconds/ms for clean display
        tenMinutesLater.setSeconds(0);
        tenMinutesLater.setMilliseconds(0);

        return tenMinutesLater.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-[#f1f8f6]">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <main className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-coffee-dark mb-8">Order History</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No past orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => {
                            // 割引判定
                            const hasBeverage = order.items.some(item => item.category === 'Hot' || item.category === 'Ice');
                            const hasFoodOrDessert = order.items.some(item => item.category === 'Food' || item.category === 'Dessert');
                            const hasDiscount = hasBeverage && hasFoodOrDessert;

                            // 元の合計金額を計算
                            const originalTotal = order.items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);

                            return (
                                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                        <div>
                                            <div className="flex items-center text-gray-500 text-sm mb-1">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(order.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-coffee-dark font-bold text-lg">
                                                <Clock className="w-5 h-5 mr-2 text-coffee-green" />
                                                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500 mb-1">Estimated Pickup</div>
                                            <div className="text-xl font-bold text-coffee-green">
                                                {calculatePickupTime(order.date)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => {
                                            const isBeverage = item.category === 'Hot' || item.category === 'Ice';
                                            const itemOriginalPrice = item.selectedPrice * item.quantity;
                                            const itemDiscountedPrice = hasDiscount && isBeverage
                                                ? Math.round(itemOriginalPrice * 0.9)
                                                : itemOriginalPrice;
                                            const itemHasDiscount = hasDiscount && isBeverage;

                                            return (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-700">{item.quantity}x</span>
                                                        <span className="text-gray-800">{item.name}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                            {item.size} / {item.temperature}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        {itemHasDiscount ? (
                                                            <>
                                                                <div className="text-xs text-gray-400 line-through">¥{itemOriginalPrice}</div>
                                                                <div className="text-coffee-green font-bold">¥{itemDiscountedPrice}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-600">¥{itemOriginalPrice}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {hasDiscount && (
                                        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-xs text-green-700 font-bold">🎉 Combo Discount Applied (10% OFF on beverages)</p>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-600">Total</span>
                                        <div className="text-right">
                                            {hasDiscount ? (
                                                <>
                                                    <div className="text-sm text-gray-400 line-through">¥{originalTotal}</div>
                                                    <div className="font-bold text-xl text-coffee-green">¥{order.total}</div>
                                                </>
                                            ) : (
                                                <span className="font-bold text-xl text-coffee-dark">¥{order.total}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
