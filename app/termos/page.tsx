import { FileText, Scale, AlertTriangle, Users, Calendar, Mail, ExternalLink, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Termos de Utilização | VETO",
  description: "Conheça os termos e condições de utilização da plataforma VETO para monitorização da legislação portuguesa.",
  openGraph: {
    images: [
      {
        url: `/api/og?title=Termos de Utilização&subtitle=Condições de uso da plataforma`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    images: [`/api/og?title=Termos de Utilização&subtitle=Condições de uso da plataforma`],
  },
}

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900 dark:from-blue-900 dark:to-blue-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white animate-blob"></div>
          <div className="absolute top-3/4 left-2/3 w-64 h-64 rounded-full bg-white animate-blob animation-delay-2000"></div>
          <div className="absolute top-2/3 left-1/4 w-64 h-64 rounded-full bg-white animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="mb-6 inline-flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Scale className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Termos de Utilização
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Conheça os termos e condições que regem a utilização da plataforma VETO e os direitos e deveres de todos os utilizadores.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Uso Gratuito</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Acesso Público</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-slate-50 dark:bg-slate-950/50">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Última atualização: 20 de janeiro de 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Ao utilizar a plataforma VETO, concorda com estes Termos de Utilização. 
                Se não concordar com qualquer parte destes termos, não deve utilizar os nossos serviços.
              </AlertDescription>
            </Alert>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Estes Termos de Utilização estabelecem as condições sob as quais pode aceder e utilizar a plataforma VETO, 
                dedicada à monitorização e análise da legislação portuguesa. Ao aceitar estes termos, estabelece um acordo 
                legal connosco que rege a sua utilização dos nossos serviços.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* About the Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  1. Sobre o Serviço VETO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>A VETO é uma plataforma digital que oferece:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Monitorização Legislativa
                    </h4>
                    <p className="text-sm text-muted-foreground">Acompanhamento em tempo real de propostas legislativas no Parlamento Português.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Análise de Votações
                    </h4>
                    <p className="text-sm text-muted-foreground">Informação detalhada sobre como os deputados votam em diferentes propostas.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Alertas Personalizados
                    </h4>
                    <p className="text-sm text-muted-foreground">Notificações sobre temas legislativos do seu interesse.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Dados Públicos
                    </h4>
                    <p className="text-sm text-muted-foreground">Acesso a informação legislativa de fontes oficiais e públicas.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm">
                    <strong>Natureza do Serviço:</strong> A VETO é uma plataforma informativa e não substitui o acesso direto 
                    às fontes oficiais. Não prestamos aconselhamento jurídico nem representamos qualquer entidade política.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  2. Aceitação dos Termos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Ao aceder ou utilizar a plataforma VETO, concorda expressamente com estes Termos de Utilização:</p>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">2.1 Capacidade Legal</h4>
                    <p className="text-muted-foreground text-sm">Declara ter capacidade legal para celebrar este acordo. Se é menor de idade, deve ter autorização parental.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">2.2 Aceitação Completa</h4>
                    <p className="text-muted-foreground text-sm">A utilização do serviço implica a aceitação integral destes termos, incluindo futuras atualizações.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">2.3 Termos Adicionais</h4>
                    <p className="text-muted-foreground text-sm">Algumas funcionalidades podem estar sujeitas a termos adicionais que serão apresentados no momento da utilização.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Obligations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  3. Obrigações do Utilizador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Como utilizador da VETO, compromete-se a:</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">3.1 Uso Adequado</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Utilizar a plataforma apenas para fins legítimos e legais</li>
                      <li>Não interferir com o funcionamento normal do serviço</li>
                      <li>Não tentar aceder a áreas restritas ou dados não autorizados</li>
                      <li>Respeitar os direitos de propriedade intelectual</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3.2 Proibições Específicas</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Reproduzir, distribuir ou modificar conteúdos sem autorização</li>
                      <li>Usar robots, scrapers ou outras ferramentas automatizadas</li>
                      <li>Tentar descompilar, reverter ou extrair código fonte</li>
                      <li>Transmitir vírus, malware ou código malicioso</li>
                      <li>Usar a plataforma para fins comerciais não autorizados</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3.3 Responsabilidade pelas Ações</h4>
                    <p className="text-muted-foreground">É totalmente responsável por todas as ações realizadas através da sua utilização da plataforma.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  4. Propriedade Intelectual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">4.1 Conteúdo da VETO</h4>
                    <p className="text-muted-foreground">Todos os direitos de propriedade intelectual sobre a plataforma, incluindo design, código, logótipos e marca VETO, pertencem-nos ou aos nossos licenciadores.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">4.2 Dados Legislativos</h4>
                    <p className="text-muted-foreground">Os dados legislativos são de domínio público, obtidos de fontes oficiais. A nossa compilação, análise e apresentação destes dados está protegida por direitos de autor.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">4.3 Licença de Utilização</h4>
                    <p className="text-muted-foreground">Concedemos-lhe uma licença limitada, não exclusiva e revogável para utilizar a plataforma para fins pessoais e não comerciais.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">4.4 Conteúdo do Utilizador</h4>
                    <p className="text-muted-foreground">Qualquer feedback, sugestão ou conteúdo que nos envie pode ser utilizado livremente para melhorar os nossos serviços.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  5. Disponibilidade do Serviço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">5.1 Melhor Esforço</h4>
                    <p className="text-muted-foreground">Esforçamo-nos para manter a plataforma disponível 24/7, mas não garantimos disponibilidade ininterrupta.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">5.2 Manutenção e Atualizações</h4>
                    <p className="text-muted-foreground">Reservamo-nos o direito de realizar manutenção, atualizações ou modificações que possam temporariamente afetar o serviço.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">5.3 Suspensão ou Descontinuação</h4>
                    <p className="text-muted-foreground">Podemos suspender ou descontinuar o serviço, total ou parcialmente, a qualquer momento, com aviso prévio sempre que possível.</p>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Em caso de interrupção prolongada, faremos o possível para 
                    notificar os utilizadores através dos canais disponíveis.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  6. Isenções de Responsabilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">6.1 Natureza Informativa</h4>
                    <p className="text-muted-foreground">A VETO é uma plataforma puramente informativa. Não prestamos aconselhamento jurídico, político ou de investimento.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">6.2 Exatidão dos Dados</h4>
                    <p className="text-muted-foreground">Embora nos esforcemos pela exatidão, não garantimos que todas as informações estejam sempre corretas, completas ou atualizadas.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">6.3 Fontes Externas</h4>
                    <p className="text-muted-foreground">Não somos responsáveis pelo conteúdo ou disponibilidade de sites externos para os quais possamos ter ligações.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">6.4 Decisões do Utilizador</h4>
                    <p className="text-muted-foreground">Qualquer decisão tomada com base nas informações da plataforma é da sua exclusiva responsabilidade.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  7. Limitação de Responsabilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Na máxima extensão permitida por lei:</p>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">7.1 Exclusão de Danos</h4>
                    <p className="text-muted-foreground text-sm">Não seremos responsáveis por danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes da utilização ou incapacidade de utilizar a plataforma.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">7.2 Limite Máximo</h4>
                    <p className="text-muted-foreground text-sm">Em caso algum, a nossa responsabilidade total excederá o valor pago pelos serviços nos últimos 12 meses (sendo os serviços gratuitos, o limite é zero).</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">7.3 Jurisdições Específicas</h4>
                    <p className="text-muted-foreground text-sm">Algumas jurisdições não permitem limitações de responsabilidade, pelo que as limitações acima podem não se aplicar na sua totalidade.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  8. Cessação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">8.1 Cessação pelo Utilizador</h4>
                    <p className="text-muted-foreground">Pode cessar a utilização da plataforma a qualquer momento, simplesmente deixando de a utilizar.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">8.2 Cessação pela VETO</h4>
                    <p className="text-muted-foreground">Podemos suspender ou cessar o seu acesso em caso de violação destes termos ou por outras razões legítimas.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">8.3 Efeitos da Cessação</h4>
                    <p className="text-muted-foreground">Após a cessação, cessam todos os direitos de utilização, mas as disposições sobre propriedade intelectual e limitação de responsabilidade mantêm-se em vigor.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  9. Lei Aplicável e Jurisdição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">9.1 Lei Portuguesa</h4>
                    <p className="text-muted-foreground text-sm">Estes Termos de Utilização são regidos pela lei portuguesa, excluindo as suas normas de conflito de leis.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">9.2 Tribunais Portugueses</h4>
                    <p className="text-muted-foreground text-sm">Para resolução de qualquer litígio, são competentes os tribunais portugueses, sem prejuízo de outros mecanismos de resolução de conflitos.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">9.3 Resolução Amigável</h4>
                    <p className="text-muted-foreground text-sm">Encorajamos a resolução amigável de conflitos através de contacto direto antes de recorrer aos tribunais.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  10. Alterações aos Termos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Reservamo-nos o direito de modificar estes Termos de Utilização:</p>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">10.1 Notificação de Alterações</h4>
                    <p className="text-muted-foreground text-sm">Alterações materiais serão comunicadas através de aviso proeminente na plataforma ou por email, com antecedência mínima de 30 dias.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">10.2 Aceitação das Alterações</h4>
                    <p className="text-muted-foreground text-sm">A utilização continuada da plataforma após as alterações constitui aceitação dos novos termos.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">10.3 Direito de Cessação</h4>
                    <p className="text-muted-foreground text-sm">Se não concordar com as alterações, pode cessar a utilização da plataforma antes da entrada em vigor.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  11. Contactos e Suporte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Para questões relacionadas com estes Termos de Utilização ou suporte técnico:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Contacto Geral</h4>
                    <p className="text-sm text-muted-foreground">
                      Email: <a href="mailto:info@veto.pt" className="text-blue-600 dark:text-blue-400 hover:underline">info@veto.pt</a><br />
                      Website: <a href="https://veto.pt" className="text-blue-600 dark:text-blue-400 hover:underline">https://veto.pt</a>
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Suporte Técnico</h4>
                    <p className="text-sm text-muted-foreground">
                      Para questões técnicas ou problemas<br />
                      de acesso à plataforma, contacte-nos<br />
                      através do email indicado.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm">
                    <strong>Tempo de Resposta:</strong> Procuramos responder a todas as questões no prazo de 48 horas úteis. 
                    Para questões urgentes, indique claramente a urgência no assunto do email.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Miscellaneous */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  12. Disposições Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">12.1 Acordo Completo</h4>
                    <p className="text-muted-foreground text-sm">Estes termos, juntamente com a Política de Privacidade, constituem o acordo completo entre as partes.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">12.2 Severabilidade</h4>
                    <p className="text-muted-foreground text-sm">Se alguma disposição for considerada inválida, as restantes disposições mantêm-se em pleno vigor.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">12.3 Renúncia</h4>
                    <p className="text-muted-foreground text-sm">A nossa falha em fazer valer qualquer direito não constitui renúncia a esse direito.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">12.4 Cessão</h4>
                    <p className="text-muted-foreground text-sm">Não pode ceder os seus direitos ou obrigações sem o nosso consentimento prévio por escrito.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Footer Note */}
      <section className="py-8">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Estes Termos de Utilização estão em conformidade com a legislação portuguesa e europeia aplicável. 
              Para mais informações sobre o tratamento de dados pessoais, consulte a nossa 
              <a href="/privacidade" className="text-blue-600 dark:text-blue-400 hover:underline mx-1">
                Política de Privacidade
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
