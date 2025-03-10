"use client"
import { 
    ArrowRight, 
    BarChart3, 
    Clock, 
    FileText, 
    Search, 
    Users, 
    Vote, 
    Building2,
    AlertCircle,
    CheckCircle2
  } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function HeroSection() {
    return (
        <>
          {/* Hero Section */}
          <section className="w-full h-screen flex items-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-900 dark:via-blue-800 dark:to-blue-950 text-white overflow-hidden relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div
                className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-white animate-pulse"
                style={{ animationDuration: "4s", animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-[40%] left-[80%] w-32 h-32 rounded-full bg-white animate-pulse"
                style={{ animationDuration: "6s", animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-[70%] left-[25%] w-20 h-20 rounded-full bg-white animate-pulse"
                style={{ animationDuration: "5s", animationDelay: "1.5s" }}
              ></div>
              <div
                className="absolute top-[20%] left-[60%] w-16 h-16 rounded-full bg-white animate-pulse"
                style={{ animationDuration: "7s", animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute top-[60%] left-[70%] w-28 h-28 rounded-full bg-white animate-pulse"
                style={{ animationDuration: "8s", animationDelay: "2s" }}
              ></div>
            </div>
          </div>
  
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col space-y-6">
                <Badge className="w-fit bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm px-3 py-1">
                  <AlertCircle className="mr-1 h-3 w-3" /> Decisões que afetam a sua vida
                </Badge>
  
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                  Quem decide o seu{" "}
                  <span className="relative inline-block">
                    futuro?
                    <span className="absolute bottom-1 left-0 w-full h-2 bg-yellow-400 opacity-70 rounded"></span>
                  </span>
                </h1>
  
                <p className="text-xl text-white/80 max-w-[600px]">
                  Descubra como os deputados votam em temas que importam para si. Acompanhe, compare e participe na
                  democracia portuguesa.
                </p>
  
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/propostas">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-white/90 dark:bg-white dark:text-blue-900 dark:hover:bg-white/90"
                  >
                    Descobrir Propostas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                  
                  {/* <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white dark:border-white dark:text-white dark:hover:bg-white/10"
                  >
                    Como Funciona
                  </Button> */}
                </div>
  
                <div className="pt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-1 h-4 w-4 text-green-300" />
                    <span>Dados oficiais</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-1 h-4 w-4 text-green-300" />
                    <span>Atualizado diariamente</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-1 h-4 w-4 text-green-300" />
                    <span>Fácil de entender</span>
                  </div>
                </div>
              </div>
  
              <div className="hidden lg:flex justify-center items-center relative">
                <div className="relative w-full max-w-md aspect-square">
                  {/* Central parliament icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-pulse"
                      style={{ animationDuration: "3s" }}
                    >
                      <Building2 className="h-16 w-16 text-white" />
                    </div>
                  </div>
  
                  {/* Orbiting elements */}
                  <div className="absolute inset-0" style={{ animation: "spin 20s linear infinite" }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full bg-yellow-400/80 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-blue-900" />
                      </div>
                    </div>
                  </div>
  
                  <div className="absolute inset-0" style={{ animation: "spin 25s linear infinite reverse" }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <div className="w-16 h-16 rounded-full bg-green-400/80 flex items-center justify-center">
                        <Vote className="h-8 w-8 text-blue-900" />
                      </div>
                    </div>
                  </div>
  
                  <div className="absolute inset-0" style={{ animation: "spin 30s linear infinite" }}>
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full bg-red-400/80 flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-900" />
                      </div>
                    </div>
                  </div>
  
                  <div className="absolute inset-0" style={{ animation: "spin 22s linear infinite reverse" }}>
                    <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full bg-purple-400/80 flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-blue-900" />
                      </div>
                    </div>
                  </div>
  
                  {/* Connection lines */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-white/20 rounded-full"></div>
                    <div className="absolute w-3/4 h-3/4 border-2 border-white/15 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <style jsx global>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </section>
        </>
    )
}