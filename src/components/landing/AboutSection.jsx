import { motion } from "framer-motion";
import { ShieldCheck, Eye, Clock, Lock } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Segurança Total", desc: "Seus dados são protegidos com criptografia e seguindo as normas da LGPD." },
  { icon: Eye, title: "Anonimato Opcional", desc: "Faça sua denúncia sem precisar se identificar, se preferir." },
  { icon: Clock, title: "Acompanhamento", desc: "Acompanhe o status da sua denúncia a qualquer momento via protocolo." },
  { icon: Lock, title: "Sigilo Garantido", desc: "Apenas administradores autorizados têm acesso às informações." },
];

export default function AboutSection() {
  return (
    <section className="py-24" id="sobre">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Por que denunciar é importante?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              O bullying pode causar danos profundos e duradouros na vida de crianças e adolescentes. 
              Denunciar é o primeiro passo para proteger vítimas e construir um ambiente escolar mais seguro.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nossa plataforma foi desenvolvida para facilitar esse processo, garantindo que cada relato 
              seja tratado com seriedade, sigilo e profissionalismo pela equipe escolar.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-primary/5 rounded-2xl p-4">
                <p className="text-3xl font-bold text-primary">1 em 3</p>
                <p className="text-sm text-muted-foreground mt-1">estudantes sofre bullying</p>
              </div>
              <div className="bg-accent/5 rounded-2xl p-4">
                <p className="text-3xl font-bold text-accent">70%</p>
                <p className="text-sm text-muted-foreground mt-1">não denunciam por medo</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
