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
        Para recomendar produtos, adicione o id do produto no formato {{productId}}, os produtos mecionados serão exibidos logo abaixo em formato de carrousel, alinhados horizontalmente, como se fosse um painel de exibição pra caso queira auxiliar o usuario a localizar o produto, a substring "{{produtoId}}" será removida, então não se preocupe onde vai coloca-la.
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
                const recommendedPrompt = `Você deve recomendar produtos e ajudar os clientes a encontrar o que estão procurando com base no estoque de produtosm atualmente são estes: ${products.map(p => `id: ${p.id}, name: ${p.name}, description: ${p.description}, category: ${p.category}`).join('\n')}.`
                setChatMessages([{ sender: "system", message: PROMP_CONFIG + recommendedPrompt }, { sender: "ai", message: MESSAGE_WELCOME }]);
                localStorage.setItem('chatMessages', JSON.stringify([{ sender: "system", message: PROMP_CONFIG + recommendedPrompt }, { sender: "ai", message: MESSAGE_WELCOME }]));
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