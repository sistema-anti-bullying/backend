import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProtocol, BULLYING_TYPES } from "@/lib/utils";
import { Shield, Upload, CheckCircle, Copy, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const LOCATIONS = [
  "Sala de aula", "Pátio", "Banheiro", "Corredor", "Quadra esportiva",
  "Cantina / Refeitório", "Entrada / Saída", "Ônibus escolar", "Redes sociais / Online", "Outro"
];

const GRADES = [
  "1º Ano EF", "2º Ano EF", "3º Ano EF", "4º Ano EF", "5º Ano EF",
  "6º Ano EF", "7º Ano EF", "8º Ano EF", "9º Ano EF",
  "1º Ano EM", "2º Ano EM", "3º Ano EM", "Outro"
];

export default function ReportForm() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    victim_name: "",
    prefer_not_victim: false,
    aggressor_name: "",
    class_grade: "",
    incident_date: "",
    incident_location: "",
    bullying_type: "",
    description: "",
    has_witnesses: false,
    witness_names: "",
    is_anonymous: false,
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const urls = [];
    
    try {
      for (const file of selectedFiles) {
        try {
          const { file_url } = await base44.integrations.Core.UploadFile({ file });
          if (file_url) {
            urls.push(file_url);
          } else {
            toast.error(`Erro ao enviar ${file.name}: URL não recebida`);
          }
        } catch (fileError) {
          console.error(`Erro ao enviar arquivo ${file.name}:`, fileError);
          toast.error(`Erro ao enviar ${file.name}`);
        }
      }
      
      if (urls.length > 0) {
        setFiles(prev => [...prev, ...urls]);
        toast.success(`${urls.length} arquivo(s) enviado(s) com sucesso`);
      } else {
        toast.error("Nenhum arquivo foi enviado com sucesso");
      }
    } catch (error) {
      console.error("Erro na função de upload:", error);
      toast.error("Erro ao processar upload de arquivos");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.bullying_type || !form.description) {
      toast.error("Preencha o tipo de bullying e a descrição.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const protocol = generateProtocol();
      const data = {
        protocol,
        is_anonymous: form.is_anonymous,
        victim_name: form.prefer_not_victim ? "Prefiro não informar" : form.victim_name,
        aggressor_name: form.aggressor_name,
        class_grade: form.class_grade,
        incident_date: form.incident_date,
        incident_location: form.incident_location,
        bullying_type: form.bullying_type,
        description: form.description,
        has_witnesses: form.has_witnesses,
        witness_names: form.witness_names,
        reporter_name: form.is_anonymous ? "" : form.reporter_name,
        reporter_email: form.is_anonymous ? "" : form.reporter_email,
        reporter_phone: form.is_anonymous ? "" : form.reporter_phone,
        status: "recebida",
        urgency: "media",
        attachment_urls: files,
      };
      
      await base44.entities.Report.create(data);
      setResult(protocol);
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      toast.error("Erro ao enviar denúncia. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyProtocol = () => {
    navigator.clipboard.writeText(result);
    toast.success("Protocolo copiado!");
  };

  if (result) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Denúncia Registrada!</h1>
          <p className="text-muted-foreground mb-6">Sua denúncia foi recebida com sucesso. Guarde o número de protocolo abaixo para acompanhar o andamento.</p>
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Número do Protocolo</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-primary font-mono">{result}</span>
              <button onClick={copyProtocol} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Copy className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.href = "/"}>Voltar ao Início</Button>
            <Button onClick={() => window.location.href = "/acompanhar"}>Acompanhar Denúncia</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Registrar Denúncia</h1>
        <p className="text-muted-foreground">Preencha o formulário com o máximo de informações possível.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1">
            <div className={`h-2 rounded-full transition-colors ${step >= s ? "bg-primary" : "bg-muted"}`} />
            <p className={`text-xs mt-1 ${step >= s ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {s === 1 ? "Ocorrência" : s === 2 ? "Detalhes" : "Identificação"}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle>Dados da Ocorrência</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label>Nome da Vítima</Label>
                  <Input placeholder="Nome completo da vítima" value={form.victim_name} onChange={e => update("victim_name", e.target.value)} disabled={form.prefer_not_victim} />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox checked={form.prefer_not_victim} onCheckedChange={v => update("prefer_not_victim", v)} />
                    <Label className="text-sm text-muted-foreground cursor-pointer">Prefiro não informar</Label>
                  </div>
                </div>
                <div>
                  <Label>Nome do Agressor (se souber)</Label>
                  <Input placeholder="Nome do agressor" value={form.aggressor_name} onChange={e => update("aggressor_name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Turma / Série</Label>
                    <Select value={form.class_grade} onValueChange={v => update("class_grade", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Data do Ocorrido</Label>
                    <Input type="date" value={form.incident_date} onChange={e => update("incident_date", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Local</Label>
                  <Select value={form.incident_location} onValueChange={v => update("incident_location", v)}>
                    <SelectTrigger><SelectValue placeholder="Onde aconteceu?" /></SelectTrigger>
                    <SelectContent>{LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo de Bullying</Label>
                  <Select value={form.bullying_type} onValueChange={v => update("bullying_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(BULLYING_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>Próximo</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle>Detalhes e Provas</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label>Descrição Detalhada</Label>
                  <Textarea placeholder="Descreva o que aconteceu com o máximo de detalhes possível..." className="min-h-[150px]" value={form.description} onChange={e => update("description", e.target.value)} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox checked={form.has_witnesses} onCheckedChange={v => update("has_witnesses", v)} />
                    <Label className="cursor-pointer">Houve testemunhas?</Label>
                  </div>
                  {form.has_witnesses && (
                    <Input placeholder="Nome das testemunhas (separado por vírgula)" value={form.witness_names} onChange={e => update("witness_names", e.target.value)} />
                  )}
                </div>
                <div>
                  <Label>Anexar Provas (imagens, vídeos, documentos)</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Arraste arquivos ou clique para selecionar</p>
                    <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileUpload} accept="image/*,video/*,.pdf,.doc,.docx" />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild><span>{uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</> : "Selecionar Arquivos"}</span></Button>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((url, i) => (
                        <div key={i} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="truncate flex-1">Arquivo {i + 1} enviado</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                  <Button onClick={() => setStep(3)}>Próximo</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card>
              <CardHeader><CardTitle>Identificação (Opcional)</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox checked={form.is_anonymous} onCheckedChange={v => update("is_anonymous", v)} />
                    <Label className="font-medium cursor-pointer">Desejo fazer esta denúncia de forma anônima</Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">Nenhum dado pessoal será armazenado.</p>
                </div>
                {!form.is_anonymous && (
                  <div className="space-y-4">
                    <div>
                      <Label>Seu Nome</Label>
                      <Input placeholder="Nome completo" value={form.reporter_name} onChange={e => update("reporter_name", e.target.value)} />
                    </div>
                    <div>
                      <Label>Seu E-mail</Label>
                      <Input type="email" placeholder="email@exemplo.com" value={form.reporter_email} onChange={e => update("reporter_email", e.target.value)} />
                    </div>
                    <div>
                      <Label>Telefone (opcional)</Label>
                      <Input placeholder="(00) 00000-0000" value={form.reporter_phone} onChange={e => update("reporter_phone", e.target.value)} />
                    </div>
                  </div>
                )}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                  <Button onClick={handleSubmit} disabled={submitting} className="min-w-[160px]">
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</> : "Enviar Denúncia"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}