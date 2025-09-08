import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, TrendingUp, Star } from "lucide-react";

const ProfileStats = ({ stats }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card className="gradient-subtle border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalServices}</div>
        <p className="text-xs text-muted-foreground">+2 novos este mês</p>
      </CardContent>
    </Card>
    <Card className="gradient-subtle border-accent/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalContracts}</div>
        <p className="text-xs text-muted-foreground">+7 novos este mês</p>
      </CardContent>
    </Card>
    <Card className="gradient-subtle border-success/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Ganhos Totais</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">R$ {stats.totalEarnings.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% este mês</p>
      </CardContent>
    </Card>
    <Card className="gradient-subtle border-yellow-500/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">4.85</div>
        <p className="text-xs text-muted-foreground">Baseado em 34 avaliações</p>
      </CardContent>
    </Card>
  </div>
);

export default ProfileStats;
