import { useSelector, useDispatch } from 'react-redux'
import {
  fetchCart,
  addItemToCart,
  updateItem,
  removeItem,
  toggleCart,
  openCart,
  closeCart,
} from '../store/slices/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const cart     = useSelector((s) => s.cart)

  return {
    ...cart,
    fetchCart:    ()              => dispatch(fetchCart()),
    addToCart:    (payload)       => dispatch(addItemToCart(payload)),
    updateItem:   (payload)       => dispatch(updateItem(payload)),
    removeItem:   (productId)     => dispatch(removeItem(productId)),
    toggleCart:   ()              => dispatch(toggleCart()),
    openCart:     ()              => dispatch(openCart()),
    closeCart:    ()              => dispatch(closeCart()),
  }
}
