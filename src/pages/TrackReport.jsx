import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileSearch, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { STATUS_MAP, BULLYING_TYPES } from "../lib/utils/protocol";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

const STATUS_ORDER = ["recebida", "em_analise", "em_investigacao", "em_andamento", "resolvida", "encerrada"];

export default function TrackReport() {
  const [protocol, setProtocol] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!protocol.trim()) return;
    setLoading(true);
    setNotFound(false);
    setReport(null);
    const results = await base44.entities.Report.filter({ protocol: protocol.trim() });
    if (results.length > 0) {
      setReport(results[0]);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  const currentIndex = report ? STATUS_ORDER.indexOf(report.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileSearch className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Acompanhar Denúncia</h1>
        <p className="text-muted-foreground">Insira o número do protocolo para verificar o status da sua denúncia.</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              placeholder="Ex: 2024-1234-ABC"
              value={protocol}
              onChange={e => setProtocol(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="text-lg font-mono"
            />
            <Button onClick={handleSearch} disabled={loading} className="px-6">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {notFound && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Denúncia não encontrada</h3>
          <p className="text-muted-foreground">Verifique se o número do protocolo está correto e tente novamente.</p>
        </motion.div>
      )}

      {report && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Protocolo</p>
                  <p className="text-xl font-bold font-mono text-primary">{report.protocol}</p>
                </div>
                <Badge className={`${STATUS_MAP[report.status]?.color} border px-4 py-1.5 text-sm`}>
                  {STATUS_MAP[report.status]?.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="font-medium">{BULLYING_TYPES[report.bullying_type] || report.bullying_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data do Registro</p>
                  <p className="font-medium">{format(new Date(report.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-0">
                <p className="text-sm font-medium text-foreground mb-4">Progresso</p>
                <div className="flex items-center gap-0">
                  {STATUS_ORDER.map((s, i) => {
                    const isCompleted = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isCompleted ? "bg-primary border-primary" : "bg-muted border-border"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                            {isCompleted ? <CheckCircle className="w-4 h-4 text-primary-foreground" /> : <Clock className="w-3 h-3 text-muted-foreground" />}
                          </div>
                          <p className={`text-[10px] mt-1 text-center max-w-[60px] ${isCompleted ? "text-primary font-medium" : "text-muted-foreground"}`}>
                            {STATUS_MAP[s]?.label}
                          </p>
                        </div>
                        {i < STATUS_ORDER.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}