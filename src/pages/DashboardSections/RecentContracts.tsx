import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Skeleton from "@/components/Skeleton";

interface Contract {
  id: string;
  status: string;
  value: number;
  deadline: string;
  services?: { title: string };
  client_profile?: { full_name: string };
  provider_profile?: { full_name: string };
}

const RecentContracts = ({ contracts, loading }: { contracts: Contract[]; loading?: boolean }) => {
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pendente",
      in_progress: "Em Andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return statusMap[status] || status;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in_progress": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  if (loading) {
    return <Skeleton height="200px" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contratos Recentes</CardTitle>
        <CardDescription>Acompanhe o status dos seus contratos</CardDescription>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum contrato encontrado. Contrate um serviço para começar!
          </p>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Link 
                key={contract.id} 
                to={`/contracts/${contract.id}`}
                className="block p-4 border rounded-lg hover:shadow-card transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">
                      {contract.services?.title || "Serviço"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {contract.client_profile?.full_name && `Cliente: ${contract.client_profile.full_name}`}
                      {contract.provider_profile?.full_name && `Prestador: ${contract.provider_profile.full_name}`}
                    </p>
                    {contract.deadline && (
                      <p className="text-sm text-muted-foreground">
                        Prazo: {new Date(contract.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusVariant(contract.status)}>
                      {getStatusLabel(contract.status)}
                    </Badge>
                    <p className="text-sm font-semibold mt-1">
                      R$ {Number(contract.value).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentContracts;
