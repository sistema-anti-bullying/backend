import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StatsCard from "../../components/admin/StatsCard";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BULLYING_TYPES, STATUS_MAP } from "../../lib/utils/protocol";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export default function Dashboard() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["all-reports"],
    queryFn: () => base44.entities.Report.list("-created_date", 500),
    initialData: [],
  });

  const total = reports.length;
  const pending = reports.filter(r => r.status === "recebida").length;
  const resolved = reports.filter(r => r.status === "resolvida" || r.status === "encerrada").length;
  const critical = reports.filter(r => r.urgency === "critica" || r.urgency === "alta").length;

  // Type distribution
  const typeData = Object.entries(BULLYING_TYPES).map(([key, label]) => ({
    name: label,
    value: reports.filter(r => r.bullying_type === key).length,
  })).filter(d => d.value > 0);

  // Monthly data
  const monthlyData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = format(d, "MMM", { locale: ptBR });
    const count = reports.filter(r => {
      const rd = new Date(r.created_date);
      return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
    }).length;
    monthlyData.push({ month, total: count });
  }

  const recentReports = reports.slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das denúncias</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total" value={total} icon={FileText} color="bg-primary" subtitle="denúncias registradas" />
        <StatsCard title="Pendentes" value={pending} icon={Clock} color="bg-amber-500" subtitle="aguardando análise" />
        <StatsCard title="Resolvidas" value={resolved} icon={CheckCircle} color="bg-green-500" subtitle="casos encerrados" />
        <StatsCard title="Urgentes" value={critical} icon={AlertTriangle} color="bg-red-500" subtitle="alta prioridade" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Denúncias por Mês</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Por Tipo de Bullying</CardTitle></CardHeader>
          <CardContent>
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">Sem dados</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Denúncias Recentes</CardTitle></CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma denúncia registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-medium text-primary">{r.protocol}</span>
                    <span className="text-sm text-muted-foreground">{BULLYING_TYPES[r.bullying_type]}</span>
                  </div>
                  <Badge className={`${STATUS_MAP[r.status]?.color} border text-xs`}>
                    {STATUS_MAP[r.status]?.label}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}