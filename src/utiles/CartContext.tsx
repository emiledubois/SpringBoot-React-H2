import { createContext, useContext, useEffect, useMemo, useReducer, ReactNode } from 'react';

export type CartItem = {
    id: string | number;
    title: string;
    price: number;
    image?: string;
    qty: number;
};

type CartState = { items: CartItem[] };

type CartContextType = {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addToCart: (p: Omit<CartItem, 'qty'>, qty?: number) => void;
    removeFromCart: (id: CartItem['id']) => void;
    setQty: (id: CartItem['id'], qty: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

function cartReducer(state: CartState, action: any): CartState {
    switch (action.type) {
        case 'ADD': {
            const { id, title, price, image, qty } = action.payload as CartItem;
            const exists = state.items.find(i => i.id === id);
            const items = exists
                ? state.items.map(i => (i.id === id ? { ...i, qty: i.qty + qty } : i))
                : [...state.items, { id, title, price, image, qty }];
            return { ...state, items };
        }
        case 'REMOVE':
            return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
        case 'SET_QTY': {
            const { id, qty } = action.payload as { id: CartItem['id']; qty: number };
            const items = state.items.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
            return { ...state, items };
        }
        case 'CLEAR':
            return { ...state, items: [] };
        case 'LOAD':
            return action.payload as CartState;
        default:
            return state;
    }
}

const initialState: CartState = { items: [] };

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // cargar lo guardado
    useEffect(() => {
        const saved = localStorage.getItem('cart_state');
        if (saved) {
            try {
                dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
            } catch { }
        }
    }, []);

    // guardar automáticamente
    useEffect(() => {
        localStorage.setItem('cart_state', JSON.stringify(state));
    }, [state]);

    const totalItems = useMemo(() => state.items.reduce((a, b) => a + b.qty, 0), [state.items]);
    const totalPrice = useMemo(() => state.items.reduce((a, b) => a + b.price * b.qty, 0), [state.items]);

    const value: CartContextType = {
        items: state.items,
        totalItems,
        totalPrice,
        addToCart: (p, qty = 1) => dispatch({ type: 'ADD', payload: { ...p, qty } }),
        removeFromCart: id => dispatch({ type: 'REMOVE', payload: { id } }),
        setQty: (id, qty) => dispatch({ type: 'SET_QTY', payload: { id, qty } }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
