import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Plataforma Segura e Confidencial
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Sua voz importa.{" "}
              <span className="text-primary">Denuncie</span> o bullying.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Uma plataforma segura para relatar casos de bullying escolar. 
              Você pode denunciar de forma anônima e acompanhar o andamento do seu caso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/denunciar">
                <Button size="lg" className="text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Fazer Denúncia
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/acompanhar">
                <Button variant="outline" size="lg" className="text-base px-8 py-6 rounded-xl">
                  <Search className="mr-2 w-5 h-5" />
                  Acompanhar Denúncia
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Denúncia Protegida</p>
                    <p className="text-sm text-muted-foreground">100% Confidencial</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 bg-muted rounded-full w-full" />
                  <div className="h-3 bg-muted rounded-full w-4/5" />
                  <div className="h-3 bg-muted rounded-full w-3/5" />
                  <div className="flex gap-3 mt-6">
                    <div className="h-10 bg-primary/20 rounded-lg flex-1" />
                    <div className="h-10 bg-accent/20 rounded-lg flex-1" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl shadow-xl p-4 border border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Protocolo #2024-0847</p>
                    <p className="text-xs text-muted-foreground">Denúncia recebida</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
