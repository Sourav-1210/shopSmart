import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((i) => i._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  let initialItems = [];
  try {
    const stored = localStorage.getItem('shopsmart_cart');
    if (stored && stored !== 'undefined' && stored !== 'null') {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        initialItems = parsed;
      }
    }
  } catch (err) {
    console.error('Error parsing cart from localStorage:', err);
  }

  const initialState = { items: initialItems };
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('shopsmart_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name.substring(0, 30)}... added to cart!`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
    }
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
