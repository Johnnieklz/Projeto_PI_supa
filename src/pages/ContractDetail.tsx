import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MessageCircle, Star, CheckCircle2, AlertCircle, Upload, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock contract data
const contract = {
  id: "1",
  service: {
    title: "Design Gráfico Profissional",
    category: "Design"
  },
  client: {
    name: "João Silva",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    email: "joao@email.com"
  },
  provider: {
    name: "Ana Silva", 
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  status: "Em Andamento",
  value: 299,
  createdAt: "2025-01-10",
  deadline: "2025-01-15",
  progress: 65,
  description: "Criação de logo e identidade visual para empresa de tecnologia. Preciso de um design moderno e profissional que transmita confiança e inovação.",
  requirements: "Logo em diferentes formatos (PNG, SVG, JPG), Manual de identidade visual, Cartão de visita, Papel timbrado",
  deliverables: [
    {
      name: "Proposta inicial do logo",
      status: "Concluído",
      date: "2025-01-11",
      file: "logo-proposta-v1.pdf"
    },
    {
      name: "Revisão baseada no feedback",
      status: "Concluído", 
      date: "2025-01-12",
      file: "logo-proposta-v2.pdf"
    },
    {
      name: "Logo final em diferentes formatos",
      status: "Em Andamento",
      date: null,
      file: null
    },
    {
      name: "Manual de identidade visual",
      status: "Pendente",
      date: null,
      file: null
    }
  ]
};

const messages = [
  {
    id: "1",
    sender: "client",
    message: "Olá Ana! Adorei a primeira proposta. Poderia deixar a fonte um pouco mais moderna?",
    timestamp: "2025-01-11T10:30:00",
    files: []
  },
  {
    id: "2", 
    sender: "provider",
    message: "Claro! Vou fazer os ajustes e enviar a nova versão hoje à tarde. Obrigada pelo feedback!",
    timestamp: "2025-01-11T14:15:00",
    files: []
  },
  {
    id: "3",
    sender: "provider", 
    message: "Aqui está a nova versão com a fonte mais moderna. O que acha?",
    timestamp: "2025-01-12T16:20:00",
    files: ["logo-proposta-v2.pdf"]
  },
  {
    id: "4",
    sender: "client",
    message: "Perfeito! Agora ficou exatamente como imaginei. Pode prosseguir com os próximos itens.",
    timestamp: "2025-01-12T18:45:00",
    files: []
  }
];

const ContractDetail = () => {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído": return "default";
      case "Em Andamento": return "secondary";
      case "Pendente": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "Em Andamento": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Pendente": return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast.success("Mensagem enviada!");
      setNewMessage("");
    }
  };

  const handleCompleteContract = () => {
    toast.success("Contrato marcado como concluído!");
  };

  const daysRemaining = Math.ceil((new Date(contract.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{contract.service.category}</Badge>
                      <Badge variant={getStatusColor(contract.status)}>{contract.status}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{contract.service.title}</CardTitle>
                    <CardDescription className="mt-2">
                      Contrato #{contract.id} • Criado em {new Date(contract.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      R$ {contract.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} dias restantes` : "Prazo vencido"}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Descrição do Projeto</h4>
                    <p className="text-muted-foreground">{contract.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Requisitos</h4>
                    <p className="text-muted-foreground">{contract.requirements}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Progresso do Projeto</h4>
                      <span className="text-sm font-medium">{contract.progress}%</span>
                    </div>
                    <Progress value={contract.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card>
              <CardHeader>
                <CardTitle>Entregas</CardTitle>
                <CardDescription>
                  Acompanhe o progresso de cada item do projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contract.deliverables.map((deliverable, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(deliverable.status)}
                        <div>
                          <h5 className="font-medium">{deliverable.name}</h5>
                          {deliverable.date && (
                            <p className="text-sm text-muted-foreground">
                              Entregue em {new Date(deliverable.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(deliverable.status)}>
                          {deliverable.status}
                        </Badge>
                        {deliverable.file && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Conversas</CardTitle>
                <CardDescription>
                  Comunicação com o cliente/prestador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex space-x-3 ${message.sender === 'client' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender === 'client' ? contract.client.avatar : contract.provider.avatar} />
                        <AvatarFallback>
                          {message.sender === 'client' ? contract.client.name[0] : contract.provider.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-md ${message.sender === 'client' ? 'text-right' : ''}`}>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'client' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          {message.files.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.files.map((file, index) => (
                                <div key={index} className="flex items-center space-x-2 text-xs">
                                  <Download className="h-3 w-3" />
                                  <span>{file}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Upload className="h-3 w-3" />
                      </Button>
                      <Button size="sm" onClick={handleSendMessage}>
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contract Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Contrato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Prazo</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(contract.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={getStatusColor(contract.status)} className="mt-1">
                      {contract.status}
                    </Badge>
                  </div>
                </div>

                {contract.status === "Em Andamento" && (
                  <Button 
                    className="w-full gradient-success"
                    onClick={handleCompleteContract}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Marcar como Concluído
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Client/Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={contract.client.avatar} />
                    <AvatarFallback>{contract.client.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{contract.client.name}</h4>
                    <p className="text-sm text-muted-foreground">{contract.client.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Avaliar Trabalho
                </Button>
                <Button variant="outline" className="w-full">
                  Reportar Problema
                </Button>
                <Button variant="outline" className="w-full text-destructive">
                  Cancelar Contrato
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractDetail;