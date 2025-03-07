import { ArrowRight, CheckCircle, ExternalLink, Globe, Mail, MapPin } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Sobre | VETO",
  description: "Conheça a nossa missão de tornar o processo legislativo português mais transparente e acessível.",
  openGraph: {
    images: [
      {
        url: `/api/og?title=Sobre&subtitle=A nossa missão e valores`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    images: [`/api/og?title=Sobre&subtitle=A nossa missão e valores`],
  },
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-900 dark:to-blue-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white animate-blob"></div>
          <div className="absolute top-3/4 left-2/3 w-64 h-64 rounded-full bg-white animate-blob animation-delay-2000"></div>
          <div className="absolute top-2/3 left-1/4 w-64 h-64 rounded-full bg-white animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Democratizando o Processo Legislativo
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Tornamos o processo legislativo português transparente e acessível para todos os cidadãos, porque
              acreditamos que a democracia funciona melhor quando todos podem participar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                Nossa Missão
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Como Funciona
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Mission Statement with Visual */}
      <section className="py-20">
        <div className="container px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-6">
                O VETO nasceu da necessidade de tornar o processo legislativo mais acessível e compreensível
                para todos os cidadãos portugueses. Acreditamos que a transparência é fundamental para uma democracia
                saudável.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                O nosso nome é inspirado no corredor central da Assembleia da República, conhecido como "Passos
                Perdidos", onde muitas das conversas e negociações políticas acontecem. Queremos trazer essas discussões
                para a luz do dia e permitir que todos os cidadãos acompanhem o que acontece no Parlamento.
              </p>
              <div className="flex flex-wrap gap-4">
                {["Transparência", "Acessibilidade", "Independência", "Inovação"].map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950 px-4 py-2 rounded-full"
                  >
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Assembleia da República"
                  width={800}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <p className="font-medium">Assembleia da República</p>
                    <p className="text-sm text-white/80">Onde as decisões são tomadas</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 z-[-1]"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-950 z-[-1]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Nossos Valores</h2>
            <p className="text-lg text-muted-foreground">Princípios que guiam o nosso trabalho e definem quem somos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Transparência",
                description:
                  "Acreditamos que a transparência é essencial para uma democracia saudável. Trabalhamos para tornar o processo legislativo transparente e acessível a todos os cidadãos.",
                icon: <Globe className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
              },
              {
                title: "Independência",
                description:
                  "Somos independentes de qualquer partido político ou grupo de interesse. O nosso compromisso é com a verdade e com a transparência, independentemente de quem esteja no poder.",
                icon: <CheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
              },
              {
                title: "Rigor",
                description:
                  "Comprometemo-nos com o rigor na recolha, análise e apresentação da informação. Verificamos cuidadosamente todas as informações antes de as publicarmos.",
                icon: <CheckCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <CardHeader className="pb-2">
                  <div className="mb-4 text-blue-600 dark:text-blue-400">{value.icon}</div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section with Tabs */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Como Trabalhamos</h2>
            <p className="text-lg text-muted-foreground">Conheça o nosso processo e metodologia</p>
          </div>

          <Tabs defaultValue="data" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="data">Dados e Fontes</TabsTrigger>
              <TabsTrigger value="process">Nosso Processo</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="animate-in fade-in-50 duration-300">
              <div className="items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Dados Confiáveis</h3>
                  <p className="text-muted-foreground mb-6">
                    Utilizamos apenas fontes oficiais e verificadas para garantir a precisão e confiabilidade das
                    informações que disponibilizamos.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Site da Assembleia da República",
                      "Diário da República",
                      "Diário da Assembleia da República",
                      "Canal Parlamento",
                    ].map((source, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </TabsContent>

            <TabsContent value="process" className="animate-in fade-in-50 duration-300">
              <div className="items-center">
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-bold mb-4">Metodologia Transparente</h3>
                  <p className="text-muted-foreground mb-6">
                    O nosso processo é transparente e rigoroso, garantindo que as informações sejam precisas, atualizadas
                    e fáceis de entender.
                  </p>
                  <ol className="space-y-4">
                    {[
                      { title: "Coleta de Dados", desc: "Coletamos dados de fontes oficiais diariamente" },
                      { title: "Verificação", desc: "Verificamos a precisão e integridade dos dados" },
                      { title: "Processamento", desc: "Transformamos dados complexos em informações acessíveis" },
                      { title: "Publicação", desc: "Disponibilizamos as informações de forma clara e objetiva" },
                    ].map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Entre em Contacto</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Tem alguma questão, sugestão ou feedback? Gostaríamos de ouvir a sua opinião.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a
                        href="mailto:info@passosperdidos.pt"
                        className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        info@passosperdidos.pt
                      </a>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-4">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Redes Sociais</h3>
                      <div className="flex gap-4 mt-2">
                        {["Twitter", "Facebook", "LinkedIn", "GitHub"].map((social) => (
                          <a
                            key={social}
                            href="#"
                            className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                          >
                            {social}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div> */}
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-2">Colabore Connosco</h3>
                  <p className="text-muted-foreground mb-4">
                    O VETO é um projeto de código aberto e depende da colaboração da comunidade.
                  </p>
                  <Button className="gap-2">
                    Como Colaborar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Envie-nos uma Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contacto consigo o mais brevemente possível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="first-name" className="text-sm font-medium">
                          Nome
                        </label>
                        <input
                          id="first-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="João"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="last-name" className="text-sm font-medium">
                          Sobrenome
                        </label>
                        <input
                          id="last-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Silva"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="joao.silva@exemplo.pt"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Assunto
                      </label>
                      <input
                        id="subject"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Assunto da mensagem"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Mensagem
                      </label>
                      <textarea
                        id="message"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Escreva a sua mensagem aqui..."
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-900 dark:to-blue-950 text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Junte-se à Nossa Missão</h2>
            <p className="text-xl text-white/80 mb-8">
              Ajude-nos a tornar a democracia mais transparente e acessível a todos os cidadãos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                Começar a Explorar
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contacte-nos
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

