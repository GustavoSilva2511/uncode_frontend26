import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router';
import type { Product } from '../types/Product';
import { useEffect, useState } from 'react';
import ItemCart from '../components/ItemCart';
import Toast from '../components/Toast';

export default function Cart() {
    const [products, setProducts] = useState<Product[]>();
    const [showToast, setShowToast] = useState<boolean>(false);
    const [messageToast, setMessageToast] = useState<string>('');

    const navigate = useNavigate();

    const handleClearCart = () => {
        sessionStorage.removeItem('cart');
        setProducts([]);
        setMessageToast('Carrinho limpo com sucesso!');
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    }

    const handleFinishPurchase = () => {
        sessionStorage.removeItem('cart');
        setProducts([]);
        setMessageToast('Compra finalizada com sucesso!');
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    }

    useEffect(() => {
        const fetchCartProducts = () => {
            const cart = sessionStorage.getItem('cart');
            const cartData: Product[] = cart ? JSON.parse(cart) : [];
            setProducts(cartData);
        }
        fetchCartProducts();
    }, []);
    return (
        <div>
            <title>Unstore - Carrinho de compras</title>
            <Header title="Carrinho de Compras" left={<button onClick={() => navigate(-1)}><ArrowLeft size={24} className="text-white"/></button>}/>
            {showToast && <Toast message={messageToast} />}
            <div className='grid grid-cols-1'>
                {products?.map((product) => (
                    <ItemCart key={product.id} product={product} products={products} setProducts={setProducts} />
                ))}
            </div>
            <footer>
                <div>
                    <h2 className="text-xl font-bold p-4">Total: R$ {products?.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0).toFixed(2)}</h2>
                </div>
                <div className="p-4 flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300" onClick={handleClearCart}>Limpar Carrinho</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 ml-2" onClick={handleFinishPurchase}
                    >Finalizar compra</button>
                </div>
            </footer>
        </div>
    )
}