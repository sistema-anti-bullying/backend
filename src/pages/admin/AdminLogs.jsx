import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLogs() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["admin-logs"],
    queryFn: () => base44.entities.AdminLog.list("-created_date", 100),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Logs de Atividade</h1>
        <p className="text-muted-foreground">Histórico de ações dos administradores</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhum log registrado.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <Card key={log.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{log.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{log.admin_email}</span>
                    {log.report_protocol && <span>• Protocolo: {log.report_protocol}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.created_date), "dd/MM/yy HH:mm", { locale: ptBR })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}