import { ArrowLeft, CirclePlus } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getAiResponse } from "../api/AiSupport";
import { getProducts } from "../api/Products";
import type { Product } from "../types/Product";    
import ItemCarousel from "../components/ItemCarousel";



export default function ChatAi() {
    const [products, setProducts] = useState<Product[]>([]);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const PROMP_CONFIG = `
        Você é um assistente de atendimento ao cliente da Unstore. 
        Forneça respostas úteis e amigáveis às perguntas dos clientes sobre nossos produtos e serviços.
        Certifique-se de ser educado, profissional e útil em todas as interações. 
        Se você não souber a resposta para uma pergunta, peça desculpas e sugira que o cliente entre em contato com nosso suporte ao cliente para obter mais assistência.
        Você não deve responder perguntas que não estejam relacionadas aos nossos produtos ou serviços e não deve recomendar ou inserir produtos ou links externos.
        Você deve sempre resumir sua resposta ao máximo de 100 palavras.
        Para recomendar produtos, escreva assim: {{aqui fica o id do produto}}. 
        Os produtos recomendados serão exibidos logo abaixo em formato de carrousel, alinhados horizontalmente, como se fosse um painel de exibição, pra caso queira auxiliar o usuario a localizar o produto.

        PRODUTOS DISPONIVEIS:
        {
            "id": 1,
            "name": "Camiseta Developer",
            "price": 79.90,
            "description": "Camiseta 100% algodao com estampa exclusiva para devs. Confortavel para longas sessoes de codigo, disponivel em preto e branco.",
            "image": "https://picsum.photos/seed/prod1/400/400",
            "category": "Vestuario",
            "stock": 15
        },
        {
            "id": 2,
            "name": "Caneca Code & Coffee",
            "price": 49.90,
            "description": "Caneca de ceramica 350ml com a frase que todo dev conhece. Resistente a microondas e lava-loucas.",
            "image": "https://picsum.photos/seed/prod2/400/400",
            "category": "Acessorios",
            "stock": 30
        },
        {
            "id": 3,
            "name": "Mouse Pad Ergonomico XL",
            "price": 89.90,
            "description": "Mouse pad extra grande (80x30cm) com apoio de pulso em gel. Superficie otimizada para precisao e conforto durante o dia todo.",
            "image": "https://picsum.photos/seed/prod3/400/400",
            "category": "Perifericos",
            "stock": 20
        },
        {
            "id": 4,
            "name": "Hub USB-C 7 Portas",
            "price": 199.90,
            "description": "Hub USB-C com 7 portas incluindo HDMI 4K, USB 3.0, leitor de cartao SD e carregamento PD 100W. Compativel com Mac e Windows.",
            "image": "https://picsum.photos/seed/prod4/400/400",
            "category": "Perifericos",
            "stock": 12
        },
        {
            "id": 5,
            "name": "Webcam Full HD 1080p",
            "price": 249.90,
            "description": "Webcam com resolucao Full HD, microfone embutido com cancelamento de ruido e correcao automatica de luz. Ideal para reunioes e streaming.",
            "image": "https://picsum.photos/seed/prod5/400/400",
            "category": "Perifericos",
            "stock": 8
        },
        {
            "id": 6,
            "name": "Teclado Mecanico Compacto",
            "price": 349.90,
            "description": "Teclado mecanico 65% com switches lineares, iluminacao RGB por tecla e conexao USB-C. Layout compacto sem perder as teclas essenciais.",
            "image": "https://picsum.photos/seed/prod6/400/400",
            "category": "Perifericos",
            "stock": 10
        },
        {
            "id": 7,
            "name": "Fone Bluetooth ANC",
            "price": 299.90,
            "description": "Fone over-ear com cancelamento ativo de ruido, bateria de 30h e modo transparencia. Dobravel e com estojo de transporte incluso.",
            "image": "https://picsum.photos/seed/prod7/400/400",
            "category": "Audio",
            "stock": 14
        },
        {
            "id": 8,
            "name": "Suporte Notebook Aluminio",
            "price": 159.90,
            "description": "Suporte ergonomico em aluminio com altura ajustavel. Melhora a postura e a ventilacao do notebook. Suporta ate 17 polegadas.",
            "image": "https://picsum.photos/seed/prod8/400/400",
            "category": "Ergonomia",
            "stock": 18
        },
        {
            "id": 9,
            "name": "Mochila Tech Impermeavel",
            "price": 189.90,
            "description": "Mochila com compartimento acolchoado para notebook ate 15.6", porta USB externa e tecido impermeavel. Organizadores internos para cabos e acessorios.",
            "image": "https://picsum.photos/seed/prod9/400/400",
            "category": "Acessorios",
            "stock": 22
        },
        {
            "id": 10,
            "name": "Monitor LED 24" Full HD",
            "price": 899.90,
            "description": "Monitor 24 polegadas IPS Full HD com bordas finas, 75Hz e suporte VESA. Cores precisas e angulo de visao amplo para produtividade.",
            "image": "https://picsum.photos/seed/prod10/400/400",
            "category": "Monitores",
            "stock": 5
        }
    
        `;
    const MESSAGE_WELCOME = "Olá! Bem-vindo ao atendimento ao cliente da Unstore. Em que posso ajudar você hoje? Estou aqui para responder a todas as suas perguntas sobre nossos produtos e serviços. Fique à vontade para perguntar!";

    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai" | "system"; message: string }[]>([]);
    const navigate = useNavigate();

    const handleSendMessage = async () => {
        if (chatInput.trim() === "") return;
        setChatMessages([...chatMessages, { sender: "user", message: chatInput }]);
        setChatInput("");
        localStorage.setItem('chatMessages', JSON.stringify([...chatMessages, { sender: "user", message: chatInput }]));
    }

    const handleClearChat = () => {
        setRecommendedProducts([]);
        setChatMessages([
            { sender: "system", message: PROMP_CONFIG },
            { sender: "ai", message: MESSAGE_WELCOME }
        ]);
        localStorage.setItem('chatMessages', JSON.stringify([
            { sender: "system", message: PROMP_CONFIG },
            { sender: "ai", message: MESSAGE_WELCOME }
        ]));
    }

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await getProducts();
            setProducts(response);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const processAiMessage = (message: string) => {
            const matches = message.matchAll(/\{\{(.+?)\}\}/g);
            const vars = Array.from(matches, m => m[1]);
            vars.forEach((varId) => {
                message = message.replace(`{{${varId}}}`, "");
                const product = products.find(p => p.id.toString() === varId);
                if (product) {
                    setRecommendedProducts(prev => {
                        if (prev.find(p => p.id === product.id)) {
                            return prev;
                        }
                        return [...prev, product];
                    });
                }
            });
            return message;
        }
        if (products.length === 0) return;
        const initializeChat = async () => {        
            const savedMessages = localStorage.getItem('chatMessages');
            if (savedMessages && JSON.parse(savedMessages)?.length > 0) {
                const parsedMessages = JSON.parse(savedMessages);
                parsedMessages.forEach((msg: { sender: "user" | "ai" | "system"; message: string }) => {
                    if (msg.sender === "ai") {
                        msg.message = processAiMessage(msg.message);
                    } 
                });
                setChatMessages(parsedMessages);
            } else {
                setChatMessages([{ sender: "system", message: PROMP_CONFIG}, { sender: "ai", message: MESSAGE_WELCOME }]);
                localStorage.setItem('chatMessages', JSON.stringify([{ sender: "system", message: PROMP_CONFIG }, { sender: "ai", message: MESSAGE_WELCOME }]));
            }
        }
        initializeChat();
    }, [products, PROMP_CONFIG]);

    useEffect(() => {
        if (chatMessages.length === 0) return;
        if (chatMessages[chatMessages.length -1].sender !== "user") return;
        getAiResponse(PROMP_CONFIG + `\n${chatMessages.map(m => `${m.sender}: ${m.message}`).join('\n')}`).then((response) => {
            setChatMessages([...chatMessages, { sender: "ai", message: response?.text || "Desculpe, não consegui entender sua solicitação." }]);
            localStorage.setItem('chatMessages', JSON.stringify([...chatMessages, { sender: "ai", message: response?.text || "Desculpe, não consegui entender sua solicitação." }]));
        }).catch((error) => {
            console.error("Erro ao obter resposta da AI:", error);
            setChatMessages([...chatMessages, { sender: "ai", message: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde." }]);
            localStorage.setItem('chatMessages', JSON.stringify([...chatMessages, { sender: "ai", message: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde." }]));
        });
    }, [chatMessages, PROMP_CONFIG, products]); 

    return (
        <div>
            <title>Unstore - Chat AI</title>
            <Header 
            title="Chat AI" 
            left={<button onClick={() => navigate(-1)}><ArrowLeft size={24} className="text-white"/></button>} 
            right={<button onClick={handleClearChat}><CirclePlus size={24} className="text-white"/></button>}/>
            <div className="w-full md:w-1/2 mx-auto relative">
                <div className="flex flex-col justify-between h-[90vh] p-4 pb-72 overflow-y-auto">
                    <div>
                        {chatMessages.length === 0 && <p className="text-gray-500 text-center">Nenhuma mensagem ainda</p>}
                        {
                            chatMessages.map((chat, index) => {
                                if (chat.sender === "system") return null;
                                return (
                                <div key={index} className={`p-4 m-2 rounded ${chat.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}>
                                    <p>{chat.message}</p>
                                </div>
                            )})
                        }
                    </div>
                </div>
                {   
                    recommendedProducts.length > 0 &&
                    <div className='snap-x flex overflow-x-auto space-x-4 p-4 snap-b fixed bottom-20 left-0 right-0 bg-white'>
                        {recommendedProducts.map((product) => (
                            <ItemCarousel size="small" key={product.id} image={product.image} title={product.name} price={product.price} id={product.id}/>
                        ))}
                    </div>
                }
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center border-t border-gray-300">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-3/4 outline-0" placeholder="Digite sua mensagem..." />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 w-1/4" onClick={handleSendMessage}>Enviar</button>
                </div>
            </div>

        </div>
    )
}