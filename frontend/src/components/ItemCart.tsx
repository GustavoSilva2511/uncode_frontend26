import { useState } from "react";
import type { Product } from "../types/Product";
import { Trash2 } from "lucide-react";
export default function ItemCart({ product, products, setProducts}: { product: Product; products: Product[]; setProducts: (products: Product[]) => void }) {
    const [quantity, setQuantity] = useState(product.quantity || 1);
    return (
        <div key={product.id} className="border-b p-2 flex items-center justify-between">
            <div className="flex items-center">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mr-4"/>
                <div>
                    <h3 className="font-bold">{product.name}</h3>
                    <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <button className="bg-red-500 text-white self-end px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300" onClick={() => {
                    const updatedProducts = products.filter(p => p.id !== product.id);
                    setProducts(updatedProducts);
                    sessionStorage.setItem('cart', JSON.stringify(updatedProducts));
                }}><Trash2 size={16} className="text-white"/></button>
                <div className="grid grid-cols-3 mt-2 shadow-md border border-gray-100 rounded w-24">
                    <button className="hover:bg-gray-200 px-2 py-1 rounded rounded-r-0" onClick={() => {
                        if (quantity > 1) {
                            setQuantity(quantity - 1);
                            const updatedProducts = products.map(p => p.id === product.id ? {...p, quantity: quantity - 1} : p);
                            setProducts(updatedProducts);
                            sessionStorage.setItem('cart', JSON.stringify(updatedProducts));
                        }
                    }}>-</button>
                    <div className="flex justify-center items-center">{quantity}</div>
                    <button className="hover:bg-gray-200 px-2 py-1 rounded rounded-l-0" onClick={() => {
                        setQuantity(quantity + 1);
                        const updatedProducts = products.map(p => p.id === product.id ? {...p, quantity: quantity + 1} : p);
                        setProducts(updatedProducts);
                        sessionStorage.setItem('cart', JSON.stringify(updatedProducts));
                    }}>+</button>
                </div>
            </div>
        </div>
    )
}