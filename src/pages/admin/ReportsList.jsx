import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Filter } from "lucide-react";
import { STATUS_MAP, BULLYING_TYPES, URGENCY_MAP } from "../../lib/utils/protocol";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["all-reports"],
    queryFn: () => base44.entities.Report.list("-created_date", 500),
    initialData: [],
  });

  const filtered = reports.filter(r => {
    const matchSearch = !search || r.protocol?.toLowerCase().includes(search.toLowerCase()) ||
      r.victim_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.aggressor_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchType = typeFilter === "all" || r.bullying_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestão de Denúncias</h1>
        <p className="text-muted-foreground">{filtered.length} denúncia(s) encontrada(s)</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por protocolo, nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                {Object.entries(BULLYING_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Nenhuma denúncia encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <Card key={r.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-bold text-primary">{r.protocol}</span>
                      <Badge className={`${STATUS_MAP[r.status]?.color} border text-xs`}>{STATUS_MAP[r.status]?.label}</Badge>
                      <Badge className={`${URGENCY_MAP[r.urgency || "media"]?.color} text-xs`}>{URGENCY_MAP[r.urgency || "media"]?.label}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{BULLYING_TYPES[r.bullying_type]}</span>
                      {r.class_grade && <span>• {r.class_grade}</span>}
                      <span>• {format(new Date(r.created_date), "dd/MM/yyyy", { locale: ptBR })}</span>
                      {r.is_anonymous && <span className="text-orange-600 font-medium">• Anônima</span>}
                    </div>
                  </div>
                  <Link to={`/admin/denuncia/${r.id}`}>
                    <Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />Detalhes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}