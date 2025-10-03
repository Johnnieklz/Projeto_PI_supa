import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Star,
  MapPin,
  Clock,
  CheckCheck,
  Check
} from "lucide-react";
import { toast } from "sonner";

// Mock conversation data
const contact = {
  name: "Ana Silva",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face",
  location: "São Paulo, SP",
  rating: 4.9,
  status: "online",
  service: "Design Gráfico Profissional",
  price: 299
};

const initialMessages = [
  {
    id: "1",
    sender: "contact",
    content: "Olá! Vi que você se interessou pelo meu serviço de design gráfico. Como posso te ajudar hoje?",
    timestamp: "10:30",
    status: "read"
  },
  {
    id: "2",
    sender: "user",
    content: "Oi Ana! Preciso de um logo para minha empresa. Você pode me contar um pouco sobre seu processo?",
    timestamp: "10:32",
    status: "read"
  },
  {
    id: "3",
    sender: "contact",
    content: "Claro! Trabalho com um processo bem colaborativo. Primeiro fazemos um briefing detalhado para entender sua visão, depois apresento algumas propostas iniciais.",
    timestamp: "10:35",
    status: "read"
  },
  {
    id: "4",
    sender: "contact",
    content: "Você tem alguma referência de estilo ou cores em mente?",
    timestamp: "10:35",
    status: "delivered"
  }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: "user" as const,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("pt-BR", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        status: "sent" as const
      };
      
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate response
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          sender: "contact" as const,
          content: "Perfeito! Vou preparar algumas opções baseadas nisso. Posso te enviar as primeiras propostas ainda hoje.",
          timestamp: new Date().toLocaleTimeString("pt-BR", { 
            hour: "2-digit", 
            minute: "2-digit" 
          }),
          status: "delivered" as const
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCall = () => {
    toast.success("Iniciando chamada de voz...");
  };

  const handleVideoCall = () => {
    toast.success("Iniciando chamada de vídeo...");
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto">
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-success rounded-full border-2 border-background"></div>
                </div>
                <div>
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {contact.location}
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{contact.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    {contact.service}
                  </Badge>
                  <div className="text-2xl font-bold text-primary">
                    R$ {contact.price}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCall}
                    className="flex items-center justify-center"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleVideoCall}
                    className="flex items-center justify-center"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button className="w-full gradient-primary shadow-glow">
                  Fazer Pedido
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <div className="flex items-center text-sm text-success">
                        <div className="h-2 w-2 bg-success rounded-full mr-2"></div>
                        Online agora
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-3 ${
                          message.sender === "user"
                            ? "gradient-primary text-primary-foreground ml-12"
                            : "bg-muted mr-12"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end mt-2 space-x-1 ${
                          message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          <span className="text-xs">{message.timestamp}</span>
                          {message.sender === "user" && getMessageStatus(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[40px] max-h-[120px]"
                      rows={1}
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="gradient-primary shadow-glow"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;