import type { Product } from "../types/Product";
import { MAIN_URL_API } from "./urls";

export const getProducts = async () => {
    const response = await fetch(`${MAIN_URL_API}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return await response.json();
}

export const getProductById = async (id: number) => {
    const response = await fetch(`${MAIN_URL_API}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    } 
    return await response.json();
}

export const addProductInCart = (product: Product) => {
    const cart = sessionStorage.getItem('cart');
    const cartData = cart ? JSON.parse(cart) : [];
    cartData.push(product);
    sessionStorage.setItem('cart', JSON.stringify(cartData));
}

export const getCartProducts = (): Product[] => {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

export const removeCartProduct = (productId: number) => {
    const cart = sessionStorage.getItem('cart');
    const cartData: Product[] = cart ? JSON.parse(cart) : [];
    const updatedCart = cartData.filter(product => product.id !== productId);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
}

export const clearCart = () => {
    sessionStorage.removeItem('cart');
}