import { motion } from "framer-motion";
import { Hand, MessageCircle, Brain, Smartphone, Users, Flag, Heart } from "lucide-react";

const types = [
  { icon: Hand, label: "Físico", color: "bg-red-50 text-red-600 border-red-100", desc: "Agressões corporais como empurrões, socos, chutes e danos materiais." },
  { icon: MessageCircle, label: "Verbal", color: "bg-orange-50 text-orange-600 border-orange-100", desc: "Insultos, apelidos ofensivos, humilhações e provocações constantes." },
  { icon: Brain, label: "Psicológico", color: "bg-purple-50 text-purple-600 border-purple-100", desc: "Intimidação, ameaças, manipulação e chantagem emocional." },
  { icon: Smartphone, label: "Cyberbullying", color: "bg-blue-50 text-blue-600 border-blue-100", desc: "Assédio online, exposição em redes sociais, mensagens ofensivas." },
  { icon: Users, label: "Social", color: "bg-green-50 text-green-600 border-green-100", desc: "Exclusão, isolamento, fofocas e destruição de relacionamentos." },
  { icon: Flag, label: "Racial", color: "bg-yellow-50 text-yellow-700 border-yellow-100", desc: "Discriminação por etnia, cor da pele, cultura ou origem." },
  { icon: Heart, label: "Sexual", color: "bg-pink-50 text-pink-600 border-pink-100", desc: "Comentários, toques indesejados, assédio de natureza sexual." },
];

export default function BullyingTypesSection() {
  return (
    <section className="py-24 bg-card" id="tipos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tipos de Bullying
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conheça as diferentes formas de bullying para identificar e denunciar corretamente.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {types.map((type, i) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-background rounded-2xl p-6 border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${type.color} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <type.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{type.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
