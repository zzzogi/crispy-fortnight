"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: string;
  createdAt: string;
  type: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Create context with a default value
const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage immediately
  const initialCart = () => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
        }
      }
    }
    return [];
  };

  const [items, setItems] = useState<CartItem[]>(initialCart());
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Track if the component has mounted
  const isMounted = useRef(false);

  // Only run localStorage operations after component has mounted
  useEffect(() => {
    isMounted.current = true;

    // Calculate initial totals
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const priceSum = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setTotalItems(itemCount);
    setTotalPrice(priceSum);

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Save cart to localStorage and update totals whenever items change
  useEffect(() => {
    if (isMounted.current) {
      if (items.length > 0) {
        localStorage.setItem("cart", JSON.stringify(items));
      } else {
        localStorage.removeItem("cart");
      }

      // Calculate totals
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const priceSum = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setTotalItems(itemCount);
      setTotalPrice(priceSum);
    }
  }, [items]);

  const addToCart = (itemToAdd: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === itemToAdd.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + itemToAdd.quantity,
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...itemToAdd }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
