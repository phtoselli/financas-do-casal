"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Heart, Wallet, TrendingUp, Target, PieChart, LineChart, 
  Shield, Smartphone, Users, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  
  const features = [
    {
      icon: Wallet,
      title: "Controle Financeiro Completo",
      description: "Acompanhe todas as receitas e despesas do casal em um só lugar, com categorias personalizadas e relatórios detalhados."
    },
    {
      icon: LineChart,
      title: "Investimentos Integrados",
      description: "Gerencie a carteira de investimentos do casal, acompanhe dividendos e visualize a distribuição por setor e tipo de ativo."
    },
    {
      icon: Target,
      title: "Metas Compartilhadas",
      description: "Definam objetivos financeiros juntos e acompanhem o progresso em tempo real. Viagem dos sonhos? Entrada do apartamento?"
    },
    {
      icon: PieChart,
      title: "Gráficos Intuitivos",
      description: "Visualize os gastos por categoria, compare a participação de cada um e tome decisões financeiras mais inteligentes."
    },
    {
      icon: Users,
      title: "Gestão em Casal",
      description: "Cada pessoa tem sua identificação própria, com filtros individuais e visão geral do orçamento familiar."
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Seus dados financeiros são protegidos com criptografia. Convite exclusivo para garantir privacidade do casal."
    }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <span className="font-bold text-xl">Finanças do Casal</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Feito para casais que sonham juntos
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Finanças do casal
              <span className="text-rose-500"> simplificadas</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Controle gastos, invistam juntos e realizem seus sonhos. 
              Um app financeiro completo pensado para casais que querem construir um futuro juntos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-rose-500/25">
                  Começar Agora
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl">
                Ver Demonstração
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Receitas", value: "R$ 14.000", color: "green" },
                    { label: "Despesas", value: "R$ 4.769", color: "rose" },
                    { label: "Saldo", value: "R$ 9.231", color: "blue" },
                    { label: "Investimentos", value: "R$ 57.519", color: "purple" }
                  ].map((item, i) => (
                    <div key={i} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-950/30 dark:to-${item.color}-900/30 p-4 rounded-xl border border-${item.color}-200 dark:border-${item.color}-800`}>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className={`text-xl font-bold text-${item.color}-600`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-slate-300" />
                  </div>
                  <div className="h-40 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Tudo que vocês precisam em um só lugar
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Ferramentas poderosas para casais que querem organizar a vida financeira juntos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simples de começar
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Em poucos minutos vocês já estão no controle das finanças
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Crie sua conta", description: "Cadastre-se e crie sua família" },
              { step: "2", title: "Convide seu par", description: "Envie um convite exclusivo" },
              { step: "3", title: "Comecem juntos", description: "Organizem a vida financeira" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-rose-500/25">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl shadow-rose-500/25"
          >
            <Heart className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comecem a construir seu futuro hoje
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Milhares de casais já estão economizando mais e realizando seus sonhos. 
              É hora de vocês começarem também!
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-rose-500 hover:bg-slate-100 text-lg px-8 py-6 rounded-xl shadow-lg">
                Criar Conta Grátis
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span className="font-semibold">Finanças do Casal</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 Finanças do Casal. Feito com ❤️ para casais.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
