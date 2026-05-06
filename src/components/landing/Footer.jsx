import { Shield, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">EscolaSegura</span>
          </div>
          <p className="text-sm opacity-60 text-center">
            Plataforma de denúncia de bullying escolar. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-sm opacity-60">
            Feito com <Heart className="w-4 h-4 text-red-400 fill-red-400" /> pela educação
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-background/10 text-center text-xs opacity-40">
          Este sistema está em conformidade com a LGPD (Lei Geral de Proteção de Dados).
          Em caso de emergência, ligue 190 (Polícia) ou 188 (CVV - Centro de Valorização da Vida).
        </div>
      </div>
    </footer>
  );
}
