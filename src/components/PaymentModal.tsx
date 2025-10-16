import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    title: string;
    price: number;
    deliveryDays: number;
    providerId: string;
  };
}

const PaymentModal = ({ open, onOpenChange, service }: PaymentModalProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix">("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  // Campos do cartão (fictício)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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

    // Simular processamento de pagamento (2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado");
        setIsProcessing(false);
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido</DialogTitle>
          <DialogDescription>
            Complete os dados para contratar: {service.title}
          </DialogDescription>
        </DialogHeader>

        {isPaid ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="rounded-full bg-success/10 p-4">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
            <h3 className="text-2xl font-bold">Pagamento Aprovado!</h3>
            <p className="text-muted-foreground text-center">
              Seu pedido foi confirmado. Você será redirecionado para acompanhar o contrato.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo do pedido */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumo do Pedido</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Serviço:</span>
                  <span className="font-medium">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prazo de entrega:</span>
                  <span>{service.deliveryDays} dias</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t">
                  <span>Total:</span>
                  <span>R$ {service.price.toLocaleString()}</span>
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
              <Label>Método de Pagamento</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Cartão de Crédito
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex items-center cursor-pointer flex-1">
                    <Smartphone className="mr-2 h-5 w-5" />
                    PIX (Aprovação Instantânea)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dados do cartão (se cartão selecionado) */}
            {paymentMethod === "credit_card" && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <h4 className="font-semibold text-sm">Dados do Cartão (Simulação)</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome completo"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Validade</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PIX */}
            {paymentMethod === "pix" && (
              <div className="p-4 border rounded-lg bg-muted/20 text-center space-y-2">
                <Smartphone className="h-12 w-12 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  O QR Code do PIX será gerado após confirmar
                </p>
                <p className="text-xs text-muted-foreground">
                  (Simulação: pagamento será aprovado automaticamente)
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
                disabled={isProcessing}
                className="flex-1 gradient-primary"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  `Pagar R$ ${service.price.toLocaleString()}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;