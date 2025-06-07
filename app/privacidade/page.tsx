import { Shield, Eye, Lock, UserCheck, Calendar, Mail, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Política de Privacidade | VETO",
  description: "Conheça como o VETO protege os seus dados pessoais e respeita a sua privacidade no acompanhamento da legislação portuguesa.",
  openGraph: {
    images: [
      {
        url: `/api/og?title=Política de Privacidade&subtitle=Proteção dos seus dados`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    images: [`/api/og?title=Política de Privacidade&subtitle=Proteção dos seus dados`],
  },
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-600 to-slate-900 dark:from-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white animate-blob"></div>
          <div className="absolute top-3/4 left-2/3 w-64 h-64 rounded-full bg-white animate-blob animation-delay-2000"></div>
          <div className="absolute top-2/3 left-1/4 w-64 h-64 rounded-full bg-white animate-blob animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="mb-6 inline-flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Shield className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Política de Privacidade
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              A sua privacidade é fundamental para nós. Conheça como protegemos os seus dados pessoais e respeitamos os seus direitos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Dados Protegidos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">RGPD Compliant</span>
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
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed">
                A VETO respeita a sua privacidade e está comprometida em proteger os seus dados pessoais. Esta Política de Privacidade explica como recolhemos, utilizamos, armazenamos e protegemos as suas informações quando utiliza os nossos serviços de monitorização legislativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Data Controller */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  1. Responsável pelo Tratamento de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O responsável pelo tratamento dos seus dados pessoais é:</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                  <p><strong>VETO</strong><br />
                  Email: info@veto.pt<br />
                  Website: https://veto.pt</p>
                </div>
                <p>Para questões relacionadas com a proteção de dados, pode contactar-nos através do email acima indicado.</p>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  2. Dados que Recolhemos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Recolhemos os seguintes tipos de dados:</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">2.1 Dados de Navegação</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Endereço IP</li>
                      <li>Tipo de navegador e versão</li>
                      <li>Sistema operativo</li>
                      <li>Páginas visitadas e tempo de permanência</li>
                      <li>Data e hora de acesso</li>
                      <li>Origem do tráfego</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2.2 Dados Fornecidos Voluntariamente</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Endereço de email (para alertas e newsletters)</li>
                      <li>Preferências de notificação</li>
                      <li>Feedback e comentários</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">2.3 Cookies e Tecnologias Semelhantes</h4>
                    <p className="text-muted-foreground">Utilizamos cookies técnicos necessários para o funcionamento do website e cookies de análise para compreender como os utilizadores interagem com a plataforma.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  3. Como Utilizamos os Seus Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Utilizamos os seus dados pessoais para as seguintes finalidades:</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">3.1 Prestação de Serviços</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Fornecer acesso à plataforma VETO</li>
                      <li>Personalizar a experiência de utilizador</li>
                      <li>Enviar alertas sobre propostas legislativas</li>
                      <li>Responder a pedidos de informação</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3.2 Melhoria dos Serviços</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Analisar o uso da plataforma</li>
                      <li>Identificar problemas técnicos</li>
                      <li>Desenvolver novas funcionalidades</li>
                      <li>Melhorar a interface e experiência do utilizador</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">3.3 Comunicação</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Enviar newsletters (apenas com consentimento)</li>
                      <li>Comunicar atualizações importantes</li>
                      <li>Responder a questões e feedback</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Basis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  4. Base Legal para o Tratamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>O tratamento dos seus dados pessoais baseia-se nas seguintes bases legais:</p>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p><strong>Interesse Legítimo:</strong> Para análise estatística, melhoria dos serviços e segurança da plataforma.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p><strong>Consentimento:</strong> Para envio de newsletters e comunicações promocionais.</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p><strong>Execução de Contrato:</strong> Para prestação dos serviços solicitados.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  5. Partilha de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>A VETO não vende, aluga ou partilha os seus dados pessoais com terceiros para fins comerciais. Apenas partilhamos dados nas seguintes situações limitadas:</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">5.1 Prestadores de Serviços</h4>
                    <p className="text-muted-foreground">Podemos partilhar dados com prestadores de serviços que nos ajudam a operar a plataforma (ex: serviços de hosting, análise de dados), sempre com contratos que garantem a proteção dos dados.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">5.2 Obrigações Legais</h4>
                    <p className="text-muted-foreground">Quando exigido por lei ou por ordem judicial.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">5.3 Proteção de Direitos</h4>
                    <p className="text-muted-foreground">Para proteger os direitos, propriedade ou segurança da VETO, dos utilizadores ou do público.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  6. Segurança dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Medidas Técnicas</h4>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                      <li>Encriptação de dados em trânsito (HTTPS)</li>
                      <li>Encriptação de dados em repouso</li>
                      <li>Firewalls e sistemas de deteção de intrusões</li>
                      <li>Backups seguros e regulares</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Medidas Organizativas</h4>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                      <li>Acesso limitado aos dados pessoais</li>
                      <li>Formação em proteção de dados</li>
                      <li>Políticas de segurança internas</li>
                      <li>Auditorias regulares de segurança</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  7. Retenção de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Conservamos os seus dados pessoais apenas pelo tempo necessário para as finalidades para as quais foram recolhidos:</p>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p><strong>Dados de Navegação:</strong> 24 meses</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p><strong>Dados de Newsletter:</strong> Até cancelar a subscrição</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <p><strong>Dados de Contacto:</strong> 3 anos após a última interação</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  8. Os Seus Direitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>De acordo com o RGPD, tem os seguintes direitos relativamente aos seus dados pessoais:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Acesso</h4>
                      <p className="text-xs text-muted-foreground">Solicitar informações sobre os dados que processamos</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Retificação</h4>
                      <p className="text-xs text-muted-foreground">Corrigir dados incorretos ou incompletos</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Apagamento</h4>
                      <p className="text-xs text-muted-foreground">Solicitar a eliminação dos seus dados</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Limitação</h4>
                      <p className="text-xs text-muted-foreground">Restringir o processamento dos seus dados</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Portabilidade</h4>
                      <p className="text-xs text-muted-foreground">Receber os seus dados num formato estruturado</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Oposição</h4>
                      <p className="text-xs text-muted-foreground">Opor-se ao processamento dos seus dados</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Retirada de Consentimento</h4>
                      <p className="text-xs text-muted-foreground">Retirar o consentimento a qualquer momento</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm">Direito de Reclamação</h4>
                      <p className="text-xs text-muted-foreground">Apresentar queixa à autoridade de proteção de dados</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm">
                    <strong>Como exercer os seus direitos:</strong> Para exercer qualquer destes direitos, contacte-nos através do email <a href="mailto:info@veto.pt" className="text-blue-600 dark:text-blue-400 hover:underline">info@veto.pt</a>. Responderemos no prazo de 30 dias.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  9. Política de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Utilizamos cookies para melhorar a sua experiência na nossa plataforma:</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">9.1 Cookies Essenciais</h4>
                    <p className="text-muted-foreground text-sm">Necessários para o funcionamento básico do website. Não podem ser desativados.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">9.2 Cookies de Análise</h4>
                    <p className="text-muted-foreground text-sm">Utilizamos o Umami Analytics para compreender como os utilizadores interagem com a plataforma. Estes cookies são anónimos e não identificam utilizadores individuais.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">9.3 Gestão de Cookies</h4>
                    <p className="text-muted-foreground text-sm">Pode gerir as suas preferências de cookies através das definições do seu navegador. Note que desativar alguns cookies pode afetar a funcionalidade do website.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  10. Alterações a Esta Política
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Podemos atualizar esta Política de Privacidade periodicamente para refletir alterações nos nossos serviços ou na legislação aplicável.</p>
                
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Notificação de Alterações:</strong> Qualquer alteração material será comunicada através de email (se tiver fornecido o seu endereço) ou através de aviso proeminente no nosso website, pelo menos 30 dias antes da entrada em vigor.
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Recomendamos que reveja esta política regularmente para se manter informado sobre como protegemos os seus dados.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  11. Contactos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Para questões relacionadas com esta Política de Privacidade ou proteção de dados, contacte-nos:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Contacto Geral</h4>
                    <p className="text-sm text-muted-foreground">
                      Email: <a href="mailto:info@veto.pt" className="text-blue-600 dark:text-blue-400 hover:underline">info@veto.pt</a><br />
                      Website: <a href="https://veto.pt" className="text-blue-600 dark:text-blue-400 hover:underline">https://veto.pt</a>
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Autoridade de Proteção de Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      <a href="https://www.cnpd.pt" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                        Comissão Nacional de Proteção de Dados (CNPD)
                      </a>
                    </p>
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
              Esta Política de Privacidade está em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) 
              e demais legislação aplicável em matéria de proteção de dados pessoais.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
