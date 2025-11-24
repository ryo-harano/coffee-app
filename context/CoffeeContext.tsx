"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  prices: { s: number; m: number; l: number };
  category: string;
  image: string;
  availableTemperatures: ('Hot' | 'Ice')[];
  availableSizes?: ('S' | 'M' | 'L')[]; // 利用可能なサイズ（未指定の場合は全サイズ）
};

export type OrderItem = MenuItem & {
  quantity: number;
  size: 'S' | 'M' | 'L';
  selectedPrice: number;
  temperature: 'Hot' | 'Ice';
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  viewed?: boolean; // 閲覧済みフラグ
};

type CoffeeContextType = {
  menuItems: MenuItem[];
  cart: OrderItem[];
  orders: Order[];
  addToCart: (item: MenuItem, size: 'S' | 'M' | 'L', quantity: number, temperature: 'Hot' | 'Ice') => void;
  removeFromCart: (itemId: string, size: 'S' | 'M' | 'L', temperature: 'Hot' | 'Ice') => void;
  clearCart: () => void;
  placeOrder: () => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  markOrdersAsViewed: () => void; // 注文を既読にする
  unviewedOrdersCount: number; // 未読注文数
};

const CoffeeContext = createContext<CoffeeContextType | undefined>(undefined);

export const CoffeeProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const storedMenu = localStorage.getItem('coffee-menu-v7');
    const storedOrders = localStorage.getItem('coffee-orders-v7');

    if (storedMenu) {
      setMenuItems(JSON.parse(storedMenu));
    } else {
      // Default menu with fixed images
      setMenuItems([
        {
          id: '1',
          name: 'Drip Coffee',
          description: 'Classic brewed coffee',
          prices: { s: 300, m: 350, l: 400 },
          category: 'Drink',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Hot']
        },
        {
          id: '2',
          name: 'Latte',
          description: 'Espresso with steamed milk',
          prices: { s: 400, m: 450, l: 500 },
          category: 'Drink',
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Hot', 'Ice']
        },
        {
          id: '3',
          name: 'Cold Brew',
          description: 'Slow-steeped cool coffee',
          prices: { s: 350, m: 400, l: 450 },
          category: 'Drink',
          image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Ice']
        },
        {
          id: '4',
          name: 'Cappuccino',
          description: 'Espresso with foamed milk',
          prices: { s: 400, m: 450, l: 500 },
          category: 'Drink',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Hot']
        },
        {
          id: '5',
          name: 'Matcha Latte',
          description: 'Green tea with milk',
          prices: { s: 450, m: 500, l: 550 },
          category: 'Drink',
          image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Hot', 'Ice']
        },
        {
          id: '6',
          name: 'Egg Sandwich',
          description: 'Classic egg salad sandwich',
          prices: { s: 400, m: 400, l: 400 },
          category: 'Food',
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: [],
          availableSizes: ['M'] // 1サイズのみ
        },
        {
          id: '7',
          name: 'BLT Sandwich',
          description: 'Bacon, lettuce, and tomato',
          prices: { s: 500, m: 500, l: 600 },
          category: 'Food',
          image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: [],
          availableSizes: ['M', 'L'] // MとLの2サイズ
        },
        {
          id: '8',
          name: 'Croissant',
          description: 'Buttery French croissant',
          prices: { s: 350, m: 350, l: 350 },
          category: 'Food',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: [],
          availableSizes: ['M'] // 1サイズのみ
        },
        {
          id: '9',
          name: 'Meat Sauce Pasta',
          description: 'Rich meat sauce pasta',
          prices: { s: 800, m: 800, l: 1000 },
          category: 'Food',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: [],
          availableSizes: ['M', 'L'] // MとLの2サイズ
        },
        {
          id: '10',
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake',
          prices: { s: 450, m: 450, l: 450 },
          category: 'Dessert',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Ice'],
          availableSizes: ['M'] // 1サイズのみ
        },
        {
          id: '11',
          name: 'Vanilla Ice Cream',
          description: 'Rich vanilla ice cream',
          prices: { s: 300, m: 300, l: 300 },
          category: 'Dessert',
          image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=800&auto=format&fit=crop',
          availableTemperatures: ['Ice'],
          availableSizes: ['M'] // 1サイズのみ
        },
      ]);
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) localStorage.setItem('coffee-menu-v7', JSON.stringify(menuItems));
  }, [menuItems, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('coffee-orders-v7', JSON.stringify(orders));
  }, [orders, isLoaded]);

  const addToCart = (item: MenuItem, size: 'S' | 'M' | 'L', quantity: number, temperature: 'Hot' | 'Ice') => {
    const price = item.prices[size.toLowerCase() as 's' | 'm' | 'l'];
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === size && i.temperature === temperature);
      if (existing) {
        return prev.map(i => (i.id === item.id && i.size === size && i.temperature === temperature)
          ? { ...i, quantity: i.quantity + quantity }
          : i
        );
      }
      return [...prev, { ...item, quantity, size, temperature, selectedPrice: price }];
    });
  };

  const removeFromCart = (itemId: string, size: 'S' | 'M' | 'L', temperature: 'Hot' | 'Ice') => {
    setCart(prev => prev.filter(i => !(i.id === itemId && i.size === size && i.temperature === temperature)));
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    if (cart.length === 0) return;

    // 飲み物とフード/デザートの判定
    const hasBeverage = cart.some(item => item.category === 'Hot' || item.category === 'Ice');
    const hasFoodOrDessert = cart.some(item => item.category === 'Food' || item.category === 'Dessert');

    // 割引適用
    let total = 0;
    const discountedItems = cart.map(item => {
      let itemPrice = item.selectedPrice * item.quantity;

      // 飲み物+フード/デザートの場合、飲み物を10%OFF
      if (hasBeverage && hasFoodOrDessert && (item.category === 'Hot' || item.category === 'Ice')) {
        itemPrice = itemPrice * 0.9; // 10% OFF
      }

      total += itemPrice;
      return item;
    });

    const newOrder: Order = {
      id: Date.now().toString(),
      items: cart,
      total: Math.round(total), // 四捨五入
      date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Sync to Sheets
    fetch('/api/sheets/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(err => console.error('Failed to sync order:', err));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    setMenuItems(prev => [...prev, newItem]);

    // Sync to Sheets
    fetch('/api/sheets/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: newItem, action: 'add' }),
    }).catch(err => console.error('Failed to sync menu item:', err));
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));

    // Sync to Sheets
    fetch('/api/sheets/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, action: 'update' }),
    }).catch(err => console.error('Failed to sync menu item:', err));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));

    // Sync to Sheets
    fetch('/api/sheets/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item: { id }, action: 'delete' }),
    }).catch(err => console.error('Failed to sync menu item:', err));
  };

  // 注文を既読にする
  const markOrdersAsViewed = () => {
    setOrders(prev => prev.map(order => ({ ...order, viewed: true })));
  };

  // 未読注文数を計算
  const unviewedOrdersCount = orders.filter(order => !order.viewed).length;

  return (
    <CoffeeContext.Provider value={{
      menuItems, cart, orders,
      addToCart, removeFromCart, clearCart, placeOrder,
      addMenuItem, updateMenuItem, deleteMenuItem,
      markOrdersAsViewed, unviewedOrdersCount
    }}>
      {children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = () => {
  const context = useContext(CoffeeContext);
  if (!context) throw new Error('useCoffee must be used within a CoffeeProvider');
  return context;
};
