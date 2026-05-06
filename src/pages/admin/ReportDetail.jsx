import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STATUS_MAP, BULLYING_TYPES, URGENCY_MAP } from "../../lib/utils/protocol";
import { ArrowLeft, User, MapPin, Calendar, FileText, Send, ExternalLink, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = window.location.pathname.split("/").pop();
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newUrgency, setNewUrgency] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: async () => {
      const reports = await base44.entities.Report.list("-created_date", 500);
      return reports.find(r => r.id === id) || null;
    },
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => base44.entities.InternalNote.filter({ report_id: id }, "-created_date"),
    initialData: [],
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Report.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", id] });
      queryClient.invalidateQueries({ queryKey: ["all-reports"] });
      toast.success("Denúncia atualizada!");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      await base44.entities.InternalNote.create({
        report_id: id,
        content: newNote,
        author_name: user.full_name || user.email,
        author_email: user.email,
      });
      await base44.entities.AdminLog.create({
        admin_email: user.email,
        action: "add_note",
        description: `Nota adicionada à denúncia ${report?.protocol}`,
        report_protocol: report?.protocol,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", id] });
      setNewNote("");
      toast.success("Nota adicionada!");
    },
  });

  const handleStatusUpdate = async () => {
    const updates = {};
    if (newStatus) updates.status = newStatus;
    if (newUrgency) updates.urgency = newUrgency;
    if (assignedTo) updates.assigned_to = assignedTo;
    if (Object.keys(updates).length === 0) return;
    const user = await base44.auth.me();
    await base44.entities.AdminLog.create({
      admin_email: user.email,
      action: "update_report",
      description: `Atualizou denúncia ${report?.protocol}: ${JSON.stringify(updates)}`,
      report_protocol: report?.protocol,
    });
    updateMutation.mutate(updates);
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>;
  if (!report) return <div className="text-center py-16 text-muted-foreground">Denúncia não encontrada.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/admin/denuncias" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-primary">{report.protocol}</h1>
            <Badge className={`${STATUS_MAP[report.status]?.color} border`}>{STATUS_MAP[report.status]?.label}</Badge>
            <Badge className={`${URGENCY_MAP[report.urgency || "media"]?.color}`}>{URGENCY_MAP[report.urgency || "media"]?.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Registrada em {format(new Date(report.created_date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
          </p>
        </div>
        {report.is_anonymous && (
          <div className="flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-xl text-sm font-medium">
            <Shield className="w-4 h-4" /> Denúncia Anônima
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" />Envolvidos</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="text-muted-foreground">Vítima:</span> <span className="font-medium">{report.victim_name || "Não informado"}</span></div>
            <div><span className="text-muted-foreground">Agressor:</span> <span className="font-medium">{report.aggressor_name || "Não informado"}</span></div>
            <div><span className="text-muted-foreground">Turma:</span> <span className="font-medium">{report.class_grade || "Não informado"}</span></div>
            {report.has_witnesses && <div><span className="text-muted-foreground">Testemunhas:</span> <span className="font-medium">{report.witness_names || "Sim"}</span></div>}
            {!report.is_anonymous && report.reporter_name && (
              <>
                <hr />
                <div><span className="text-muted-foreground">Denunciante:</span> <span className="font-medium">{report.reporter_name}</span></div>
                {report.reporter_email && <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{report.reporter_email}</span></div>}
                {report.reporter_phone && <div><span className="text-muted-foreground">Telefone:</span> <span className="font-medium">{report.reporter_phone}</span></div>}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4" />Detalhes da Ocorrência</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium">{BULLYING_TYPES[report.bullying_type]}</span></div>
            <div><span className="text-muted-foreground">Local:</span> <span className="font-medium">{report.incident_location || "Não informado"}</span></div>
            <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{report.incident_date || "Não informada"}</span></div>
            {report.assigned_to && <div><span className="text-muted-foreground">Responsável:</span> <span className="font-medium">{report.assigned_to}</span></div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />Descrição</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{report.description}</p>
        </CardContent>
      </Card>

      {report.attachment_urls?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Anexos ({report.attachment_urls.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {report.attachment_urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-muted rounded-xl text-sm hover:bg-muted/80 transition-colors">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  Arquivo {i + 1}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle className="text-base">Ações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={newStatus || report.status} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Urgência</Label>
              <Select value={newUrgency || report.urgency || "media"} onValueChange={setNewUrgency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(URGENCY_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Responsável</Label>
              <Input value={assignedTo || report.assigned_to || ""} onChange={e => setAssignedTo(e.target.value)} placeholder="Nome do responsável" />
            </div>
          </div>
          <Button onClick={handleStatusUpdate} disabled={updateMutation.isPending}>Salvar Alterações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notas Internas ({notes.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {notes.map(n => (
            <div key={n.id} className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{n.author_name}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(n.created_date), "dd/MM/yyyy HH:mm")}</span>
              </div>
              <p className="text-sm">{n.content}</p>
            </div>
          ))}
          <div className="flex gap-3">
            <Textarea placeholder="Adicionar nota interna..." value={newNote} onChange={e => setNewNote(e.target.value)} className="flex-1" />
            <Button onClick={() => addNoteMutation.mutate()} disabled={!newNote.trim() || addNoteMutation.isPending} className="self-end">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}