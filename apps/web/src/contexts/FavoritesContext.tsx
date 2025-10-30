'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Menu, Dish, EventPage } from '@/lib/api';

export interface FavoriteItem {
    id: number;
    type: 'event' | 'dish' | 'menu';
    event?: EventPage;
    dish?: Dish;
    menu?: Menu;
    addedAt: string;
}

interface FavoritesState {
    items: FavoriteItem[];
    totalItems: number;
}

type FavoritesAction =
    | { type: 'ADD_EVENT'; payload: EventPage }
    | { type: 'ADD_DISH'; payload: Dish }
    | { type: 'ADD_MENU'; payload: Menu }
    | { type: 'REMOVE_FAVORITE'; payload: { id: number; type: 'event' | 'dish' | 'menu' } }
    | { type: 'CLEAR_FAVORITES' }
    | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] };

const initialState: FavoritesState = {
    items: [],
    totalItems: 0,
};

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
    switch (action.type) {
        case 'ADD_EVENT': {
            const event = action.payload;
            const existingItem = state.items.find(item => item.type === 'event' && item.event?.id === event.id);

            if (existingItem) {
                return state; // Already in favorites
            }

            const newItem: FavoriteItem = {
                id: event.id,
                type: 'event',
                event,
                addedAt: new Date().toISOString(),
            };

            const newItems = [...state.items, newItem];
            return {
                ...state,
                items: newItems,
                totalItems: newItems.length,
            };
        }

        case 'ADD_DISH': {
            const dish = action.payload;
            const existingItem = state.items.find(item => item.type === 'dish' && item.dish?.id === dish.id);

            if (existingItem) {
                return state; // Already in favorites
            }

            const newItem: FavoriteItem = {
                id: dish.id,
                type: 'dish',
                dish,
                addedAt: new Date().toISOString(),
            };

            const newItems = [...state.items, newItem];
            return {
                ...state,
                items: newItems,
                totalItems: newItems.length,
            };
        }

        case 'ADD_MENU': {
            const menu = action.payload;
            const existingItem = state.items.find(item => item.type === 'menu' && item.menu?.id === menu.id);

            if (existingItem) {
                return state; // Already in favorites
            }

            const newItem: FavoriteItem = {
                id: menu.id,
                type: 'menu',
                menu,
                addedAt: new Date().toISOString(),
            };

            const newItems = [...state.items, newItem];
            return {
                ...state,
                items: newItems,
                totalItems: newItems.length,
            };
        }

        case 'REMOVE_FAVORITE': {
            const { id, type } = action.payload;
            const newItems = state.items.filter(item => {
                if (item.type !== type) return true;

                switch (type) {
                    case 'event':
                        return item.event?.id !== id;
                    case 'dish':
                        return item.dish?.id !== id;
                    case 'menu':
                        return item.menu?.id !== id;
                    default:
                        return true;
                }
            });

            return {
                ...state,
                items: newItems,
                totalItems: newItems.length,
            };
        }

        case 'CLEAR_FAVORITES':
            return {
                ...state,
                items: [],
                totalItems: 0,
            };

        case 'LOAD_FAVORITES':
            const items = action.payload;
            return {
                ...state,
                items,
                totalItems: items.length,
            };

        default:
            return state;
    }
}

interface FavoritesContextType {
    state: FavoritesState;
    addEvent: (event: EventPage) => void;
    addDish: (dish: Dish) => void;
    addMenu: (menu: Menu) => void;
    removeFavorite: (id: number, type: 'event' | 'dish' | 'menu') => void;
    clearFavorites: () => void;
    isFavorite: (id: number, type: 'event' | 'dish' | 'menu') => boolean;
    getFavoritesByType: (type: 'event' | 'dish' | 'menu') => FavoriteItem[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(favoritesReducer, initialState);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            try {
                const favoriteItems = JSON.parse(savedFavorites);
                dispatch({ type: 'LOAD_FAVORITES', payload: favoriteItems });
            } catch (error) {
                console.error('Failed to load favorites from localStorage:', error);
            }
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(state.items));
    }, [state.items]);

    const addEvent = (event: EventPage) => {
        dispatch({ type: 'ADD_EVENT', payload: event });
    };

    const addDish = (dish: Dish) => {
        dispatch({ type: 'ADD_DISH', payload: dish });
    };

    const addMenu = (menu: Menu) => {
        dispatch({ type: 'ADD_MENU', payload: menu });
    };

    const removeFavorite = (id: number, type: 'event' | 'dish' | 'menu') => {
        dispatch({ type: 'REMOVE_FAVORITE', payload: { id, type } });
    };

    const clearFavorites = () => {
        dispatch({ type: 'CLEAR_FAVORITES' });
    };

    const isFavorite = (id: number, type: 'event' | 'dish' | 'menu'): boolean => {
        return state.items.some(item => {
            if (item.type !== type) return false;

            switch (type) {
                case 'event':
                    return item.event?.id === id;
                case 'dish':
                    return item.dish?.id === id;
                case 'menu':
                    return item.menu?.id === id;
                default:
                    return false;
            }
        });
    };

    const getFavoritesByType = (type: 'event' | 'dish' | 'menu'): FavoriteItem[] => {
        return state.items.filter(item => item.type === type);
    };

    return (
        <FavoritesContext.Provider
            value={{
                state,
                addEvent,
                addDish,
                addMenu,
                removeFavorite,
                clearFavorites,
                isFavorite,
                getFavoritesByType,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
