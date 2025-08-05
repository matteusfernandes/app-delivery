'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl: string
  subTotal: number
}

interface CartState {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'subTotal'> }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { 
                ...item, 
                quantity: item.quantity + action.payload.quantity,
                subTotal: (item.quantity + action.payload.quantity) * item.price 
              }
            : item
        )
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: updatedItems.reduce((sum, item) => sum + item.subTotal, 0),
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
      
      const newItem: CartItem = {
        ...action.payload,
        subTotal: action.payload.price * action.payload.quantity
      }
      
      const newItems = [...state.items, newItem]
      
      return {
        ...state,
        items: newItems,
        totalPrice: newItems.reduce((sum, item) => sum + item.subTotal, 0),
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'UPDATE_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { 
              ...item, 
              quantity: action.payload.quantity,
              subTotal: action.payload.quantity * item.price 
            }
          : item
      )
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: updatedItems.reduce((sum, item) => sum + item.subTotal, 0),
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload.id)
      
      return {
        ...state,
        items: filteredItems,
        totalPrice: filteredItems.reduce((sum, item) => sum + item.subTotal, 0),
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalPrice: 0,
        totalItems: 0
      }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export type { CartItem, CartState, CartAction }
