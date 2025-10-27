import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Check, Clock, CreditCard, AlertCircle, Zap, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Tipo para os detalhes do serviço/pedido (simplificado)
interface OrderDetails {
  id: string;
  total_amount: number;
  status: string;
  services: {
    title: string;
    price: number;
  };
}

const CheckoutFlow = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Etapas do fluxo de checkout: 0=Escolha, 1=Processamento
  const [stage, setStage] = useState<0 | 1>(0);
  
  // Etapas de processamento (para o Stage 1)
  const [step, setStep] = useState(0); 
  
  // Status final da transação
  const [status, setStatus] = useState<"pending" | "processing" | "success" | "failed">("pending");
  
  // Dados do pedido
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  // Método de pagamento escolhido
  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "pix" | null>(null);
  
  // Simulação de dados do formulário de pagamento (Pix Code ou Detalhes do Cartão)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    pixCode: "00020126330014BR.GOV.BCB.PIX0111999999999995204000053039865802BR5915NOME DA EMPRESA6008CIDADE SP62070503***6304CAFE",
  });

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;

      const { data: order } = await supabase
        .from("orders")
        .select(`
          *,
          services (
            title,
            price
          )
        `)
        .eq("id", orderId)
        .single();
      
      // Assumindo que o total_amount é o preço do serviço para a simulação
      if (order) {
        setOrderDetails({ ...order, total_amount: order.services.price });
      }
    };

    loadOrder();
  }, [orderId]);

  // Função para simular o processo de pagamento
  const startPaymentProcess = () => {
    if (!paymentMethod) return;

    setStage(1); // Mudar para a tela de processamento
    setStatus("processing");
    
    // Simular passos do processamento
    const steps = [
      { delay: 1000, step: 1, label: paymentMethod === "creditCard" ? "Validando Cartão" : "Gerando Código PIX" },
      { delay: 2000, step: 2, label: "Processando Transação" },
      { delay: 3000, step: 3, label: "Confirmação Bancária" },
      { delay: 4000, step: 4, label: "Transação Concluída" }
    ];

    steps.forEach(({ delay, step }) => {
      setTimeout(() => setStep(step), delay);
    });

    // Simular resultado (90% chance de sucesso)
    setTimeout(() => {
      const success = Math.random() < 0.9;
      setStatus(success ? "success" : "failed");
      
      if (success && orderDetails) {
        // Atualiza o status no Supabase
        supabase
          .from("orders")
          .update({ status: "paid", payment_id: `TX${Date.now()}` })
          .eq("id", orderDetails.id);
      }
    }, 4500);
  };

  const getStepIcon = (stepNumber: number) => {
    if (status === "failed") return <AlertCircle className="h-6 w-6 text-destructive" />;
    if (step > stepNumber) return <Check className="h-6 w-6 text-green-500" />;
    if (step === stepNumber) return <Loader2 className="h-6 w-6 text-primary animate-spin" />;
    return <Clock className="h-6 w-6 text-muted-foreground" />;
  };

  const StepIndicator: React.FC<{ stepNumber: number, label: string }> = ({ stepNumber, label }) => (
    <div className="flex items-center gap-4">
      {getStepIcon(stepNumber)}
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {status === "failed" && stepNumber === 1 && "Verifique os dados e tente novamente."}
          {status === "success" && stepNumber === 4 && "Seu pedido está confirmado!"}
          {status === "processing" && step === stepNumber && "Aguarde..."}
        </p>
      </div>
    </div>
  );

  // --- Renderização do Formulário de Pagamento (Stage 0) ---
  const renderPaymentForm = () => (
    <CardContent>
      <h2 className="text-xl font-semibold mb-4">Selecione o Método de Pagamento</h2>
      
      {/* Botões de Seleção */}
      <div className="flex justify-center space-x-4 mb-6">
        <Button 
          variant={paymentMethod === "creditCard" ? "default" : "outline"}
          onClick={() => setPaymentMethod("creditCard")}
          className="flex-1"
        >
          <CreditCard className="w-5 h-5 mr-2" /> Cartão
        </Button>
        <Button 
          variant={paymentMethod === "pix" ? "default" : "outline"}
          onClick={() => setPaymentMethod("pix")}
          className="flex-1"
        >
          <Zap className="w-5 h-5 mr-2" /> PIX
        </Button>
      </div>

      {paymentMethod === "creditCard" && (
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Número do Cartão" 
            className="w-full p-2 border rounded"
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
          />
          <div className="flex space-x-4">
            <input 
              type="text" 
              placeholder="MM/AA" 
              className="w-1/2 p-2 border rounded"
              onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
            />
            <input 
              type="text" 
              placeholder="CVV" 
              className="w-1/2 p-2 border rounded"
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
            />
          </div>
        </div>
      )}

      {paymentMethod === "pix" && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm font-medium text-yellow-800">Pagamento por PIX garante confirmação em minutos!</p>
        </div>
      )}
      
      <CardFooter className="p-0 pt-6">
        <Button 
          className="w-full" 
          onClick={startPaymentProcess}
          disabled={!paymentMethod}
        >
          Pagar R$ {orderDetails?.total_amount.toFixed(2) || '0.00'}
        </Button>
      </CardFooter>
    </CardContent>
  );

  // --- Renderização do Processamento/Resultado (Stage 1) ---
  const renderProcessResult = () => (
    <CardContent>
      {/* Informações do PIX (apenas se for PIX e ainda estiver processando) */}
      {paymentMethod === "pix" && status === "processing" && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
          <h3 className="font-semibold text-primary">Aguardando Pagamento PIX</h3>
          <p className="text-sm text-muted-foreground mb-3">Copie o código abaixo e pague no seu aplicativo bancário.</p>
          <div className="bg-white p-3 border rounded break-all text-xs mb-3">
            {paymentInfo.pixCode}
          </div>
          <Button size="sm" onClick={() => navigator.clipboard.writeText(paymentInfo.pixCode)}>
            <Zap className="w-4 h-4 mr-1" /> Copiar Código
          </Button>
          <p className="text-xs text-red-500 mt-2">Simulação: O status mudará automaticamente em 5s.</p>
        </div>
      )}

      <div className="space-y-6">
        <StepIndicator stepNumber={1} label={paymentMethod === "creditCard" ? "Validando Cartão" : "Gerando Código PIX"} />
        <StepIndicator stepNumber={2} label="Processando Transação" />
        <StepIndicator stepNumber={3} label="Confirmação Bancária" />
        <StepIndicator stepNumber={4} label="Concluído" />
      </div>

      {/* Mensagem Final e Botão */}
      {status !== "processing" && (
        <div className="mt-8 space-y-4">
          <p className={`text-center font-semibold text-lg ${
            status === "success" ? "text-green-600" : "text-destructive"
          }`}>
            {status === "success" 
              ? "Pagamento Aprovado e Pedido Confirmado!"
              : "Transação Recusada. Tente Novamente."}
          </p>
          <Button 
            className="w-full"
            variant={status === "success" ? "default" : "destructive"}
            onClick={() => navigate(status === "success" ? `/orders/${orderDetails?.id}` : `/checkout/${orderDetails?.id}`)}
          >
            {status === "success" ? "Ver Detalhes do Pedido" : "Tentar Novamente"}
          </Button>
        </div>
      )}
    </CardContent>
  );
  
  if (!orderDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando Pedido...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            {stage === 1 && (
              <Button variant="ghost" className="self-start mb-2" onClick={() => setStage(0)} disabled={status !== "pending"}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
              </Button>
            )}
            <CardTitle className="text-center">
              {stage === 0 && "Finalizar Compra"}
              {stage === 1 && status === "processing" && "Processando Pagamento..."}
              {stage === 1 && status === "success" && "Sucesso!"}
              {stage === 1 && status === "failed" && "Falha na Transação"}
            </CardTitle>
          </CardHeader>
          
          <div className="p-4 bg-muted border-t border-b">
            <h3 className="font-semibold text-lg">{orderDetails.services.title}</h3>
            <p className="text-3xl font-bold text-primary mt-1">
              R$ {orderDetails.total_amount.toFixed(2)}
            </p>
          </div>

          {stage === 0 ? renderPaymentForm() : renderProcessResult()}
        </Card>
      </main>
    </div>
  );
};

export default CheckoutFlow;