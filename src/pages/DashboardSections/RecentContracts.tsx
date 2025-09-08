import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const RecentContracts = ({ contracts }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Contratos Recentes</CardTitle>
      <CardDescription>Acompanhe o status dos seus contratos</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {contracts.map((contract: any) => (
          <Link 
            key={contract.id} 
            to={`/contracts/${contract.id}`}
            className="block p-4 border rounded-lg hover:shadow-card transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold">{contract.service}</h4>
                <p className="text-sm text-muted-foreground">Cliente: {contract.client}</p>
                <p className="text-sm text-muted-foreground">Prazo: {new Date(contract.deadline).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge 
                  variant={
                    contract.status === "Concluído" ? "default" :
                    contract.status === "Em Andamento" ? "secondary" : 
                    "outline"
                  }
                >
                  {contract.status}
                </Badge>
                <p className="text-sm font-semibold mt-1">
                  R$ {contract.value.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default RecentContracts;
