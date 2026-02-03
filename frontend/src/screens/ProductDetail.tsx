import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { addProductInCart, getProductById } from '../api/Products';
import type { Product } from "../types/Product";
import Header from '../components/Header';
import { ArrowLeft } from "lucide-react";
import Toast from '../components/Toast';

export default function ProductDetail() {
    const [product, setProduct] = useState<Product>();
    const [showToast, setShowToast] = useState<boolean>(false);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const params = useParams();
    const navigate = useNavigate();

    const fetchCartProducts = () => {
        const cart = sessionStorage.getItem('cart');
        const cartData: Product[] = cart ? JSON.parse(cart) : [];
        setCartProducts(cartData);
    }

    const handleAddToCart = () => {
        if (product) {
            addProductInCart(product);
            setShowToast(true);
            setTimeout(() => { 
                setShowToast(false);
            }, 2000)
            fetchCartProducts();
        }
    }

    useEffect(() => {
        getProductById(params.id as unknown as number).then((product) => {
            setProduct(product);
        });
    }, [params.id]); 

    useEffect(() => {
        const onInit = () => {
            fetchCartProducts();
        }
        onInit();
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center">
            <title>Unstore - Detalhes do Produto</title>
            <Header title="Detalhes do Produto" left={<button onClick={() => navigate(-1)}><ArrowLeft size={24} className="text-white"/></button>}/>
            <div className="w-full md:w-1/2">
                <img src={product?.image} alt={product?.name} className="w-full h-96 object-cover rounded-b-2xl"/>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-gray-900">R$ {product?.price}</h2>
                    <h1 className="text-2xl font-semibold">{product?.name}</h1>
                    <p className="text-md text-gray-400">{product?.category}</p>
                    <p className="text-gray-700">{product?.description}</p>
                </div>
                <div className="p-4 flex justify-end">
                    {cartProducts.find(p => p.id === product?.id) ? (
                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300" disabled>Produto no Carrinho</button>
                    ) : (
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300" onClick={handleAddToCart}>Adicionar ao Carrinho</button>
                    )}
                </div>
            </div>
            {showToast && <Toast message="Produto adicionado ao carrinho!" />}
            
        </div>
    )
}