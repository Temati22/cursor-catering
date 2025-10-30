'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Menu, Dish, CartItem } from '@/lib/api';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    totalItems: number;
    totalAmount: number;
}

type CartAction =
    | { type: 'ADD_MENU'; payload: { menu: Menu; quantity: number } }
    | { type: 'ADD_DISH'; payload: { dish: Dish; quantity: number } }
    | { type: 'REMOVE_ITEM'; payload: { id: number; type: 'menu' | 'dish' } }
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; type: 'menu' | 'dish'; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'CLOSE_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
    items: [],
    isOpen: false,
    totalItems: 0,
    totalAmount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_MENU': {
            const { menu, quantity } = action.payload;
            const existingItem = state.items.find(item => item.menu?.id === menu.id);

            let newItems: CartItem[];
            if (existingItem) {
                newItems = state.items.map(item =>
                    item.menu?.id === menu.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [...state.items, { menu, quantity }];
            }

            return {
                ...state,
                items: newItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: newItems.reduce((sum, item) => {
                    const price = item.menu?.pricePerPerson || item.dish?.price || 0;
                    return sum + (item.quantity * price);
                }, 0),
            };
        }

        case 'ADD_DISH': {
            const { dish, quantity } = action.payload;
            const existingItem = state.items.find(item => item.dish?.id === dish.id);

            let newItems: CartItem[];
            if (existingItem) {
                newItems = state.items.map(item =>
                    item.dish?.id === dish.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [...state.items, { dish, quantity }];
            }

            return {
                ...state,
                items: newItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: newItems.reduce((sum, item) => {
                    const price = item.menu?.pricePerPerson || item.dish?.price || 0;
                    return sum + (item.quantity * price);
                }, 0),
            };
        }

        case 'REMOVE_ITEM': {
            const { id, type } = action.payload;
            const newItems = state.items.filter(item => {
                if (type === 'menu') {
                    return item.menu?.id !== id;
                } else {
                    return item.dish?.id !== id;
                }
            });
            return {
                ...state,
                items: newItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: newItems.reduce((sum, item) => {
                    const price = item.menu?.pricePerPerson || item.dish?.price || 0;
                    return sum + (item.quantity * price);
                }, 0),
            };
        }

        case 'UPDATE_QUANTITY': {
            const { id, type, quantity } = action.payload;
            if (quantity <= 0) {
                return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id, type } });
            }

            const newItems = state.items.map(item => {
                if (type === 'menu' && item.menu?.id === id) {
                    return { ...item, quantity };
                } else if (type === 'dish' && item.dish?.id === id) {
                    return { ...item, quantity };
                }
                return item;
            });

            return {
                ...state,
                items: newItems,
                totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: newItems.reduce((sum, item) => {
                    const price = item.menu?.pricePerPerson || item.dish?.price || 0;
                    return sum + (item.quantity * price);
                }, 0),
            };
        }

        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalAmount: 0,
            };

        case 'TOGGLE_CART':
            return {
                ...state,
                isOpen: !state.isOpen,
            };

        case 'CLOSE_CART':
            return {
                ...state,
                isOpen: false,
            };

        case 'LOAD_CART':
            const items = action.payload;
            return {
                ...state,
                items,
                totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: items.reduce((sum, item) => {
                    const price = item.menu?.pricePerPerson || item.dish?.price || 0;
                    return sum + (item.quantity * price);
                }, 0),
            };

        default:
            return state;
    }
}

interface CartContextType {
    state: CartState;
    addMenu: (menu: Menu, quantity?: number) => void;
    addDish: (dish: Dish, quantity?: number) => void;
    removeItem: (id: number, type: 'menu' | 'dish') => void;
    updateQuantity: (id: number, type: 'menu' | 'dish', quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const cartItems = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: cartItems });
            } catch (error) {
                console.error('Failed to load cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    const addMenu = (menu: Menu, quantity: number = 1) => {
        dispatch({ type: 'ADD_MENU', payload: { menu, quantity } });
    };

    const addDish = (dish: Dish, quantity: number = 1) => {
        dispatch({ type: 'ADD_DISH', payload: { dish, quantity } });
    };

    const removeItem = (id: number, type: 'menu' | 'dish') => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id, type } });
    };

    const updateQuantity = (id: number, type: 'menu' | 'dish', quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, type, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const toggleCart = () => {
        dispatch({ type: 'TOGGLE_CART' });
    };

    const closeCart = () => {
        dispatch({ type: 'CLOSE_CART' });
    };

    return (
        <CartContext.Provider
            value={{
                state,
                addMenu,
                addDish,
                removeItem,
                updateQuantity,
                clearCart,
                toggleCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
