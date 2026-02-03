import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Routes, Route} from "react-router";
import ProductDetail from './screens/ProductDetail.tsx';
import Cart from './screens/Cart.tsx';
import ChatAi from './screens/ChatAi.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path='/:id' element={<ProductDetail />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/chat-ai' element={<ChatAi />} />
    </Routes>
  </BrowserRouter>,
)
