"use client"

import { useState, useEffect } from "react"
import {
  Search,
  FileText,
  Users,
  BarChart3,
  Calendar,
  ArrowRight,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  Download,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"

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

            {/* Interface Mockup */}
            <div className="relative h-[500px] w-full hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                {/* Background decorative elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-600/10 rounded-2xl opacity-60 z-0"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-600/10 rounded-2xl opacity-40 z-0"></div>
                <div className="absolute top-1/2 -left-4 w-16 h-16 bg-purple-600/10 rounded-xl opacity-30 z-0"></div>

                {/* Main interface mockup */}
                <div className="relative z-10 bg-[#1a1f36]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 overflow-hidden">
                  {/* Browser header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-[#0f1419]/50 border-b border-blue-500/20">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-[#0f1419] rounded-lg px-3 py-1 text-xs text-gray-400 border border-blue-500/20">
                        veto.pt/propostas
                      </div>
                    </div>
                    <div className="w-16"></div>
                  </div>

                  {/* Interface content */}
                  <div className="p-4">
                    {/* Header section */}
                    <div className="mb-4">
                      <h1 className="text-lg font-bold text-blue-100 mb-1">Propostas Legislativas</h1>
                      <p className="text-xs text-blue-200/70">Explore e acompanhe todas as propostas em discussão no Parlamento Português.</p>
                </div>

                    {/* Search bar */}
                    <div className="mb-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Search className="h-3 w-3 text-blue-400" />
                  </div>
                        <div className="h-8 bg-[#0f1419]/50 rounded-lg border border-blue-500/20 pl-8 flex items-center">
                          <span className="text-xs text-blue-200">Pesquisar propostas...</span>
                          <div className="ml-auto mr-3 h-1 w-1 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

                    {/* Main layout with filters and content */}
                    <div className="flex gap-3">
                      {/* Filters sidebar */}
                      <div className="w-16 bg-[#0f1419]/30 rounded p-2 border border-blue-500/20">
                        <div className="text-xs text-blue-300 mb-2 font-medium">Filtros</div>
                        <div className="space-y-1">
                          <div className="h-1 bg-blue-500/40 rounded w-full"></div>
                          <div className="h-1 bg-blue-500/30 rounded w-3/4"></div>
                          <div className="h-1 bg-blue-500/20 rounded w-full"></div>
                          <div className="h-1 bg-blue-500/30 rounded w-2/3"></div>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="flex-1">
                        {/* Results count and active filters */}
                        <div className="mb-3">
                          <div className="text-xs text-blue-300 mb-2">247 propostas encontradas</div>
                          <div className="flex gap-1 flex-wrap">
                            <div className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">XVI</div>
                            <div className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">Lei</div>
                          </div>
                        </div>

                        {/* Proposal cards grid */}
                        <div className="grid grid-cols-2 gap-2">
                          <motion.div
                            className="border border-blue-500/20 rounded p-2 bg-[#0f1419]/30 hover:bg-[#0f1419]/50 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                          >
                            <div className="flex gap-1 mb-2">
                              <div className="px-1 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">Aprovado</div>
                              <div className="px-1 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">PS</div>
                            </div>
                            <div className="h-2 bg-blue-400 rounded w-full mb-1"></div>
                            <div className="h-1 bg-blue-500/20 rounded w-3/4 mb-1"></div>
                            <div className="flex items-center gap-1 text-xs text-blue-300/70">
                              <FileText className="h-2 w-2" />
                              <span>Lei</span>
                  </div>
                          </motion.div>

                          <motion.div
                            className="border border-blue-500/20 rounded p-2 bg-[#0f1419]/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4, duration: 0.5 }}
                          >
                            <div className="flex gap-1 mb-2">
                              <div className="px-1 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-xs">Em análise</div>
                              <div className="px-1 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs">PSD</div>
                </div>
                            <div className="h-2 bg-orange-400 rounded w-5/6 mb-1"></div>
                            <div className="h-1 bg-blue-500/20 rounded w-2/3 mb-1"></div>
                            <div className="flex items-center gap-1 text-xs text-blue-300/70">
                              <FileText className="h-2 w-2" />
                              <span>Decreto-Lei</span>
                  </div>
                          </motion.div>

                          <motion.div
                            className="border border-blue-500/20 rounded p-2 bg-[#0f1419]/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6, duration: 0.5 }}
                          >
                            <div className="flex gap-1 mb-2">
                              <div className="px-1 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs">Discussão</div>
                              <div className="px-1 py-0.5 bg-red-500/20 text-red-300 rounded text-xs">CH</div>
                  </div>
                            <div className="h-2 bg-red-400 rounded w-4/5 mb-1"></div>
                            <div className="h-1 bg-blue-500/20 rounded w-full mb-1"></div>
                            <div className="flex items-center gap-1 text-xs text-blue-300/70">
                              <FileText className="h-2 w-2" />
                              <span>Proposta</span>
                  </div>
                          </motion.div>

                          <motion.div
                            className="border border-blue-500/20 rounded p-2 bg-[#0f1419]/30 opacity-70"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.7, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.5 }}
                          >
                            <div className="flex gap-1 mb-2">
                              <div className="px-1 py-0.5 bg-gray-500/20 text-gray-300 rounded text-xs">Rejeitado</div>
                              <div className="px-1 py-0.5 bg-green-500/20 text-green-300 rounded text-xs">BE</div>
                  </div>
                            <div className="h-2 bg-gray-500 rounded w-3/4 mb-1"></div>
                            <div className="h-1 bg-blue-500/20 rounded w-4/5 mb-1"></div>
                            <div className="flex items-center gap-1 text-xs text-blue-300/70">
                              <FileText className="h-2 w-2" />
                              <span>Resolução</span>
                </div>
                          </motion.div>
              </div>

                        {/* Pagination */}
                        <div className="mt-3 flex justify-center">
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 bg-blue-500/30 rounded border border-blue-500/50"></div>
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <div className="w-4 h-4 bg-blue-500/30 rounded border border-blue-500/50"></div>
                            <div className="text-xs text-blue-300/70">...</div>
                            <div className="w-4 h-4 bg-blue-500/30 rounded border border-blue-500/50"></div>
                          </div>
                  </div>
                </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Navigation Link Component with hover animation
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        active ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gray-900"
        initial={{ width: active ? "100%" : "0%" }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  )
}

// Mobile Navigation Link
function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block py-2 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
      {children}
    </Link>
  )
}

