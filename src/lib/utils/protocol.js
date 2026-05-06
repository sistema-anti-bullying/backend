export function generateProtocol() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${year}-${random}-${suffix}`;
}

export const STATUS_MAP = {
  recebida: { label: "Recebida", color: "bg-blue-100 text-blue-700 border-blue-200" },
  em_analise: { label: "Em Análise", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  em_investigacao: { label: "Em Investigação", color: "bg-orange-100 text-orange-700 border-orange-200" },
  em_andamento: { label: "Em Andamento", color: "bg-purple-100 text-purple-700 border-purple-200" },
  resolvida: { label: "Resolvida", color: "bg-green-100 text-green-700 border-green-200" },
  encerrada: { label: "Encerrada", color: "bg-gray-100 text-gray-700 border-gray-200" },
};

export const BULLYING_TYPES = {
  fisico: "Físico",
  verbal: "Verbal",
  psicologico: "Psicológico",
  cyberbullying: "Cyberbullying",
  social: "Social",
  racial: "Racial",
  sexual: "Sexual",
};

export const URGENCY_MAP = {
  baixa: { label: "Baixa", color: "bg-green-100 text-green-700" },
  media: { label: "Média", color: "bg-yellow-100 text-yellow-700" },
  alta: { label: "Alta", color: "bg-orange-100 text-orange-700" },
  critica: { label: "Crítica", color: "bg-red-100 text-red-700" },
};