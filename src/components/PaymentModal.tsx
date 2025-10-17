import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Loader2, CheckCircle2, Lock, QrCode, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    title: string;
    price: number;
    deliveryDays: number;
    providerId: string;
    isDemo?: boolean;
  };
}

const PaymentModal = ({ open, onOpenChange, service }: PaymentModalProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix">("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showPixQr, setShowPixQr] = useState(false);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  // Campos do cartão (fictício)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const formatted = numbers.match(/.{1,4}/g)?.join(" ") || "";
    return formatted.substring(0, 19);
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 2) {
      return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
    }
    return numbers;
  };

  const getCardBrand = (number: string) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "Mastercard";
    if (firstDigit === "3") return "Amex";
    return "Card";
  };

  const handlePayment = async () => {
    if (!description.trim()) {
      toast.error("Por favor, descreva o que você precisa");
      return;
    }

    if (paymentMethod === "credit_card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        toast.error("Preencha todos os dados do cartão");
        return;
      }
    }

    setIsProcessing(true);

    if (paymentMethod === "pix") {
      setShowPixQr(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Simular steps de processamento
    const steps = ["Validando dados...", "Processando pagamento...", "Confirmando transação..."];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado");
        setIsProcessing(false);
        return;
      }

      // Se for serviço demo, apenas simular
      if (service.isDemo) {
        setIsPaid(true);
        toast.success("Pagamento simulado com sucesso! 🎉", {
          description: "Este é um ambiente de demonstração. Crie um serviço real para contratos reais.",
        });

        // Redirecionar após 3 segundos
        setTimeout(() => {
          onOpenChange(false);
          navigate("/dashboard");
        }, 3000);
        return;
      }

      // Calcular deadline
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + service.deliveryDays);

      // Criar contrato no banco de dados
      const { data, error } = await supabase
        .from("contracts")
        .insert({
          service_id: service.id,
          client_id: user.id,
          provider_id: service.providerId,
          value: service.price,
          payment_status: "paid",
          payment_method: paymentMethod,
          description: description,
          requirements: requirements || null,
          delivery_days: service.deliveryDays,
          deadline: deadline.toISOString(),
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      setIsPaid(true);
      toast.success("Pagamento aprovado! 🎉");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        onOpenChange(false);
        navigate(`/contracts/${data.id}`);
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao criar contrato:", error);
      toast.error("Erro ao processar pagamento");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      // Reset form
      setPaymentMethod("credit_card");
      setDescription("");
      setRequirements("");
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");
      setIsPaid(false);
      setProcessingStep(0);
      setShowPixQr(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-success" />
            Checkout Seguro
          </DialogTitle>
          <DialogDescription>
            Complete os dados para contratar: <span className="font-semibold text-foreground">{service.title}</span>
          </DialogDescription>
        </DialogHeader>

        {isPaid ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="rounded-full bg-success/10 p-6 shadow-glow animate-pulse-glow">
              <CheckCircle2 className="h-20 w-20 text-success" />
            </div>
            <h3 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              {service.isDemo ? "Simulação Concluída!" : "Pagamento Aprovado!"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {service.isDemo 
                ? "Você testou todo o fluxo de pagamento! Em um serviço real, o contrato seria criado e você seria redirecionado."
                : "Seu pedido foi confirmado com sucesso. Você será redirecionado para acompanhar o contrato em instantes."
              }
            </p>
            <div className="flex items-center gap-2 text-sm text-success">
              <Shield className="h-4 w-4" />
              <span>{service.isDemo ? "Ambiente de simulação" : "Transação 100% segura"}</span>
            </div>
            {service.isDemo && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-center">
                  💡 Crie um serviço real na página <strong>"Criar Serviço"</strong> para testar com contratos reais!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo do pedido */}
            <div className="gradient-subtle p-5 rounded-xl border shadow-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Resumo do Pedido
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Serviço:</span>
                  <span className="font-medium text-right max-w-[60%]">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prazo de entrega:</span>
                  <span className="font-medium">{service.deliveryDays} dias</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total:</span>
                  <span className="gradient-primary bg-clip-text text-transparent">
                    R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Descrição do projeto */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descreva o que você precisa <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Explique detalhadamente o que você precisa que seja feito..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requisitos específicos (opcional)</Label>
              <Textarea
                id="requirements"
                placeholder="Liste requisitos técnicos, formatos de entrega, etc..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
              />
            </div>

            {/* Método de pagamento */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Método de Pagamento</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                <div 
                  className={cn(
                    "flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all",
                    paymentMethod === "credit_card" 
                      ? "border-primary bg-primary/5 shadow-card" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1 gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Cartão de Crédito</div>
                      <div className="text-xs text-muted-foreground">Visa, Mastercard, Amex</div>
                    </div>
                  </Label>
                </div>
                <div 
                  className={cn(
                    "flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all",
                    paymentMethod === "pix" 
                      ? "border-primary bg-primary/5 shadow-card" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center cursor-pointer flex-1 gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Smartphone className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold">PIX</div>
                      <div className="text-xs text-muted-foreground">Aprovação instantânea</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dados do cartão (se cartão selecionado) */}
            {paymentMethod === "credit_card" && (
              <div className="space-y-6">
                {/* Cartão Visual */}
                <div className="relative">
                  <div className="w-full max-w-md mx-auto h-52 rounded-2xl gradient-primary p-6 text-white shadow-elegant transform transition-all hover:scale-105">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-8 bg-yellow-400/30 rounded"></div>
                      <div className="text-xs font-bold">{getCardBrand(cardNumber)}</div>
                    </div>
                    <div className="space-y-4">
                      <div className="font-mono text-xl tracking-wider">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-70">Nome no Cartão</div>
                          <div className="font-medium uppercase text-sm">
                            {cardName || "SEU NOME AQUI"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs opacity-70">Validade</div>
                          <div className="font-mono">{cardExpiry || "MM/AA"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulário do Cartão */}
                <div className="space-y-4 p-5 border-2 rounded-xl bg-card">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 text-success" />
                    Dados do Cartão
                    <span className="text-xs text-muted-foreground font-normal ml-auto">(Simulação)</span>
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="pr-10"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome completo como no cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Validade</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PIX */}
            {paymentMethod === "pix" && !showPixQr && (
              <div className="p-8 border-2 rounded-xl bg-gradient-to-br from-success/5 to-success/10 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Pagamento via PIX</h4>
                  <p className="text-sm text-muted-foreground">
                    O QR Code será gerado após você confirmar o pedido
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-success">
                  <Shield className="h-3 w-3" />
                  <span>Aprovação instantânea • Ambiente de simulação</span>
                </div>
              </div>
            )}

            {paymentMethod === "pix" && showPixQr && (
              <div className="p-8 border-2 rounded-xl bg-card text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 shadow-elegant">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-primary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Escaneie o QR Code</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Abra o app do seu banco e escaneie o código
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Aguardando pagamento...
                  </div>
                </div>
              </div>
            )}

            {/* Indicador de Processamento */}
            {isProcessing && (
              <div className="space-y-4 p-6 border-2 rounded-xl bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="font-semibold text-lg">
                    {processingStep === 0 && "Validando dados..."}
                    {processingStep === 1 && "Processando pagamento..."}
                    {processingStep === 2 && "Confirmando transação..."}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full gradient-primary transition-all duration-500"
                    style={{ width: `${((processingStep + 1) / 3) * 100}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Não feche esta janela
                </p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod === "pix" && showPixQr)}
                className="flex-1 gradient-primary hover:shadow-glow transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Pagar R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </>
                )}
              </Button>
            </div>

            {/* Selo de Segurança */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <Shield className="h-3 w-3" />
              <span>Pagamento 100% seguro e criptografado</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;