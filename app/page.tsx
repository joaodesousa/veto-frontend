import { Button } from "@/components/ui/button"
import { FileTextIcon, BarChartIcon, LandmarkIcon } from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"


export default async function Home() {
  // Party data with their colors
  const parties = [
    { id: "PS", color: "from-pink-400 to-pink-600" },
    { id: "PSD", color: "from-orange-400 to-orange-600" },
    { id: "CH", color: "from-blue-900 to-blue-950" },
    { id: "L", color: "from-green-400 to-green-600" },
    { id: "CDS", color: "from-blue-500 to-blue-700" },
    { id: "BE", color: "from-red-500 to-red-700" },
    { id: "JPP", color: "from-green-700 to-green-900" },
    { id: "PCP", color: "from-red-700 to-red-900" },
    { id: "IL", color: "from-[#89CFF0] to-[#6CB4D9]" },
    { id: "PAN", color: "from-green-700 to-green-900" }
  ]
  
  // Fisher-Yates shuffle algorithm
  const shuffledParties = [...parties]
  for (let i = shuffledParties.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledParties[i], shuffledParties[j]] = [shuffledParties[j], shuffledParties[i]]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white overflow-hidden flex flex-col">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]"></div>
        <div className="absolute -right-[5%] top-[10%] h-[250px] w-[250px] rounded-full bg-indigo-600/10 blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[30%] h-[350px] w-[350px] rounded-full bg-purple-600/5 blur-[100px]"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container relative z-10 mx-auto flex-1 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Badge */}
          <div className="hidden sm:inline-flex items-center rounded-full bg-[#1a1f36] px-4 py-1.5 text-sm shadow-lg">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
            Decisões Parlamentares
          </div>

          {/* Hero Content */}
          <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8 pt-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left min-h-[60vh]">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Quem decide o seu{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  futuro?
                </span>
              </h1>
              <p className="max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed">
                Descubra como os deputados votam em temas que importam para si. Acompanhe, compare e participe na democracia portuguesa.
              </p>
              <div className="flex flex-wrap gap-5 pt-2 justify-center lg:justify-start">
                <Link href="/propostas">
                <Button className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30">
                  Explorar Propostas
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 h-4 w-4"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-900/30 text-green-500 shadow-lg shadow-green-900/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="m9 11 3 3L22 4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">Dados oficiais</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/30 text-blue-500 shadow-lg shadow-blue-900/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">Atualizado diariamente</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30 text-purple-500 shadow-lg shadow-purple-900/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">Fácil de entender</span>
                </div>
              </div>
            </div>

            {/* Cards - Enhanced with glass effect and animations */}
            <div className="relative h-[500px] w-full hidden lg:block">
              {/* Propostas Card */}
              <div className="absolute left-0 top-10 w-72 rounded-xl card-glass p-6 float-medium z-10 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 hover:shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                    <FileTextIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Propostas</h3>
                </div>
                <p className="text-sm leading-relaxed text-blue-100/80">Acompanhe todas as propostas legislativas</p>
                <div className="mt-4 space-y-2">
                  <div className="h-1 w-full rounded-full bg-blue-900/50">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  </div>
                  <div className="h-1 w-full rounded-full bg-blue-900/50">
                    <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  </div>
                </div>
              </div>

              {/* Votações Card */}
              <div className="absolute right-5 top-32 w-64 rounded-xl card-glass p-6 float-slow z-20 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 hover:shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                    <BarChartIcon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Votações</h3>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Aprovadas</span>
                    <span className="text-xs text-gray-400">64%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-indigo-900/50">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Rejeitadas</span>
                    <span className="text-xs text-gray-400">36%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-indigo-900/50">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
                  </div>
                </div>
              </div>

              {/* Assembleia Card */}
              <div className="absolute bottom-0 left-16 w-80 rounded-xl card-glass p-6 float-fast z-30 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 hover:shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                    <LandmarkIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Assembleia da República</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-blue-100/80">O centro da democracia Portuguesa</p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  {shuffledParties.map((party) => (
                    <div key={party.id} className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${party.color} shadow-lg`}></div>
                      <span className="mt-2 text-xs text-gray-400">{party.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

