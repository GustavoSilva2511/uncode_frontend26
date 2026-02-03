import { useEffect, useState } from 'react';
import CardItem from './components/CardItem';
import Header from './components/Header';
import { getCartProducts, getProducts } from './api/Products';
import type { Product } from './types/Product';
import { NavLink } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import ItemCarousel from './components/ItemCarousel';

function App() {
  const [products, setProducts] = useState<Product[]>();
  const [totalCartItems, setTotalCartItems] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      if (setProducts) {
        const response = await getProducts();
        setProducts(response);
      }
    };
    fetchProducts();
    const getCartProductsCount = () => {
        const cartProducts = getCartProducts();
        setTotalCartItems(cartProducts.length);
    }
    getCartProductsCount();
  }, []);

  
  return (
      <div className='min-h-screen bg-gray-50'>
        <title>Unstore - Página principal</title>
        <Header title="Unstore" right={
          <div className='flex'>
            <NavLink to="/cart"><ShoppingCart size={24} className="ml-4 text-white"/></NavLink>
            {totalCartItems > 0 && <div className="inline-block bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 text-center -mt-2 -mr-2">{totalCartItems}</div>}
          </div>
        }/>
        <h2 className="text-xl font-bold p-4">Produtos em Destaque</h2>
        <div className='snap-x flex overflow-x-auto space-x-4 p-4 snap-b'>
          {
            products?.map((product) => (
              <ItemCarousel key={product.id} image={product.image} title={product.name} price={product.price} id={product.id}/>
            ))
          }
        </div>
        
        <h2 className="text-xl font-bold p-4">Produtos recomendados</h2>
        <div className='grid grid-cols-2 gap-2 p-2 md:grid-cols-4 lg:grid-cols-6'>
          {
            products?.map((product) => (
              <CardItem key={product.id} image={product.image} title={product.name} price={product.price} id={product.id}/>
            ))
          }
        </div>

        <div className='fixed bottom-0 left-0 right-0 flex justify-end p-4 mb-4'>
          <NavLink className='bg-blue-600 text-white p-2 rounded-lg' to='/chat-ai'>Atendimento com IA</NavLink>
        </div>

        <footer className="bg-gray-100">
          <div className="p-4 text-center text-gray-500">
            &copy; 2024 Gustavo Silva. Todos os direitos reservados.
          </div>
        </footer>
      </div>
  )
}

export default App
