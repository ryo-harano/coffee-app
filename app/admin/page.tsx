"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCoffee, MenuItem } from '@/context/CoffeeContext';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import CartDrawer from '@/components/CartDrawer';

export default function AdminPage() {
    const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useCoffee();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
        name: '',
        description: '',
        prices: { s: 0, m: 0, l: 0 },
        category: 'Hot',
        image: '',
        availableTemperatures: ['Hot'],
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            prices: { s: 0, m: 0, l: 0 },
            category: 'Hot',
            image: '',
            availableTemperatures: ['Hot']
        });
        setEditingItem(null);
        setIsAdding(false);
    };

    const handleEditClick = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            prices: { ...item.prices },
            category: item.category,
            image: item.image,
            availableTemperatures: item.availableTemperatures || ['Hot'],
        });
        setIsAdding(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAdding) {
            addMenuItem(formData);
        } else if (editingItem) {
            updateMenuItem({ ...formData, id: editingItem.id });
        }
        resetForm();
    };

    const toggleTemperature = (temp: 'Hot' | 'Ice') => {
        setFormData(prev => {
            const temps = prev.availableTemperatures.includes(temp)
                ? prev.availableTemperatures.filter(t => t !== temp)
                : [...prev.availableTemperatures, temp];
            return { ...prev, availableTemperatures: temps };
        });
    };

    return (
        <div className="min-h-screen bg-[#f1f8f6]">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-coffee-dark">Menu Management</h1>
                    {!isAdding && !editingItem && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-coffee-green text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold hover:bg-[#004f32] transition-colors"
                        >
                            <Plus className="w-5 h-5" /> Add Item
                        </button>
                    )}
                </header>

                {(isAdding || editingItem) && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-coffee-light animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold mb-4 text-coffee-dark">
                            {isAdding ? 'Add New Item' : 'Edit Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (S)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.prices.s}
                                        onChange={e => setFormData({ ...formData, prices: { ...formData.prices, s: Number(e.target.value) } })}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (M)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.prices.m}
                                        onChange={e => setFormData({ ...formData, prices: { ...formData.prices, m: Number(e.target.value) } })}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (L)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.prices.l}
                                        onChange={e => setFormData({ ...formData, prices: { ...formData.prices, l: Number(e.target.value) } })}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-coffee-green outline-none"
                                    >
                                        <option value="Hot">Hot</option>
                                        <option value="Ice">Ice</option>
                                        <option value="Food">Food</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Temperatures</label>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.availableTemperatures.includes('Hot')}
                                                onChange={() => toggleTemperature('Hot')}
                                                className="w-4 h-4 text-coffee-green focus:ring-coffee-green"
                                            />
                                            <span>Hot</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.availableTemperatures.includes('Ice')}
                                                onChange={() => toggleTemperature('Ice')}
                                                className="w-4 h-4 text-coffee-green focus:ring-coffee-green"
                                            />
                                            <span>Ice</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-coffee-green text-white rounded-md font-bold hover:bg-[#004f32] transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-coffee-cream text-coffee-dark">
                            <tr>
                                <th className="p-4 font-bold">Image</th>
                                <th className="p-4 font-bold">Name</th>
                                <th className="p-4 font-bold hidden sm:table-cell">Category</th>
                                <th className="p-4 font-bold">Temps</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {menuItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-coffee-dark">{item.name}</div>
                                        <div className="text-xs text-gray-500 sm:hidden">{item.category}</div>
                                    </td>
                                    <td className="p-4 hidden sm:table-cell">
                                        <span className="px-2 py-1 bg-coffee-cream text-coffee-green text-xs rounded-full font-semibold">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {item.availableTemperatures?.join(', ') || 'Hot'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this item?')) deleteMenuItem(item.id);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
