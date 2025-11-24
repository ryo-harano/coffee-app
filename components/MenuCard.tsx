"use client";
import { Plus } from 'lucide-react';
import { MenuItem } from '@/context/CoffeeContext';

export default function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col h-full group">
            <div className="h-48 overflow-hidden relative bg-gray-100">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                    {item.availableTemperatures && item.availableTemperatures.length > 0 && item.category === 'Drink' ? (
                        item.availableTemperatures.map(temp => (
                            <span
                                key={temp}
                                className="px-2 py-1 text-xs font-bold rounded-full shadow-sm bg-white/90 backdrop-blur-sm text-gray-600 border border-gray-200"
                            >
                                {temp}
                            </span>
                        ))
                    ) : (
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold rounded-full shadow-sm text-coffee-dark">
                            {item.category}
                        </span>
                    )}
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-coffee-dark mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-0 line-clamp-2">{item.description}</p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        {/* Removed "From" text as per request */}
                        <span className="font-bold text-lg text-coffee-dark">¥{item.prices.s} ~</span>
                    </div>
                    <button
                        onClick={() => onAdd(item)}
                        className="bg-coffee-green text-white p-2.5 rounded-full hover:bg-[#004f32] transition-colors shadow-md active:scale-95"
                        aria-label="Add to cart"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
