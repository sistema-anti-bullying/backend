import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "A denúncia é realmente anônima?", a: "Sim! Se você escolher a opção de denúncia anônima, nenhuma informação pessoal será coletada ou armazenada. Apenas o conteúdo da denúncia será registrado." },
  { q: "Como acompanho minha denúncia?", a: "Ao finalizar a denúncia, você receberá um número de protocolo único. Use esse número na página 'Acompanhar Denúncia' para verificar o status a qualquer momento." },
  { q: "Quem terá acesso à minha denúncia?", a: "Apenas os administradores autorizados da instituição (direção, coordenação, psicólogos) terão acesso aos dados da denúncia, seguindo rigorosos protocolos de sigilo." },
  { q: "Posso anexar provas?", a: "Sim! Você pode enviar imagens, vídeos, documentos e prints de tela que comprovem o ocorrido." },
  { q: "O que acontece depois da denúncia?", a: "Sua denúncia será analisada pela equipe responsável, que tomará as providências necessárias. Você pode acompanhar cada etapa pelo número de protocolo." },
  { q: "Posso fazer uma denúncia em nome de outra pessoa?", a: "Sim. Pais, responsáveis, professores e funcionários também podem registrar denúncias em nome de alunos que estejam sofrendo bullying." },
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-card" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">Perguntas Frequentes</h2>
          <p className="text-muted-foreground text-lg">Tire suas dúvidas sobre o sistema de denúncias.</p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-xl border border-border/50 px-6 shadow-sm">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
