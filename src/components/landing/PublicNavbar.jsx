import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">EscolaSegura</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sobre</a>
            <a href="/#tipos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tipos</a>
            <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            <Link to="/acompanhar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Acompanhar</Link>
            <Link to="/denunciar">
              <Button size="sm" className="rounded-lg">Fazer Denúncia</Button>
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="/#sobre" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>Sobre</a>
            <a href="/#tipos" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>Tipos</a>
            <a href="/#faq" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>FAQ</a>
            <Link to="/acompanhar" className="block text-sm text-muted-foreground py-2" onClick={() => setOpen(false)}>Acompanhar</Link>
            <Link to="/denunciar" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full rounded-lg">Fazer Denúncia</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
