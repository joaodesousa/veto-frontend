"use client"

import {
  Briefcase,
  Coins,
  Crown,
  Gavel,
  GraduationCap,
  Heart,
  Home,
  Network,
  Plane,
  Scale,
  Shield,
  TreePine,
  Users,
  Zap,
  Icon,
  Calendar,
  MapPin,
  Building2
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

type Member = {
  role: string;
  name: string;
  party: string;
  photoUrl: string;
  icon: React.ElementType;
  isStateMinister?: boolean;
};

const governmentMembers: Member[] = [
  {
    role: "Primeiro-Ministro",
    name: "Luís Montenegro",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063784.jpg",
    icon: Crown,
  },
  {
    role: "Ministro de Estado e dos Negócios Estrangeiros",
    name: "Paulo Rangel",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063781.jpg",
    icon: Plane,
    isStateMinister: true,
  },
  {
    role: "Ministro de Estado e das Finanças",
    name: "Joaquim Miranda Sarmento",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063785.jpg",
    icon: Coins,
    isStateMinister: true,
  },
  {
    role: "Ministro da Presidência",
    name: "António Leitão Amaro",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063786.jpg",
    icon: Briefcase,
  },
  {
    role: "Ministro da Economia e Coesão Territorial",
    name: "Manuel Castro Almeida",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063787.jpg",
    icon: Briefcase,
  },
  {
    role: "Ministro Adjunto e da Reforma do Estado",
    name: "Gonçalo Saraiva Matias",
    party: "Independente",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063907.jpg",
    icon: Network,
  },
  {
    role: "Ministro dos Assuntos Parlamentares",
    name: "Carlos Abreu Amorim",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063790.jpg",
    icon: Gavel,
  },
  {
    role: "Ministro da Defesa Nacional",
    name: "Nuno Melo",
    party: "CDS-PP",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063791.jpg",
    icon: Shield,
  },
  {
    role: "Ministra da Administração Interna",
    name: "Maria Lúcia Amaral",
    party: "Independente",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063908.jpg",
    icon: Shield,
  },
  {
    role: "Ministra da Justiça",
    name: "Rita Júdice",
    party: "Independente",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063793.jpg",
    icon: Scale,
  },
  {
    role: "Ministro das Infraestruturas e Habitação",
    name: "Miguel Pinto Luz",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063792.jpg",
    icon: Home,
  },
  {
    role: "Ministro da Educação, Ciência e Inovação",
    name: "Fernando Alexandre",
    party: "Independente",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063795.jpg",
    icon: GraduationCap,
  },
  {
    role: "Ministra da Saúde",
    name: "Ana Paula Martins",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063796.jpg",
    icon: Heart,
  },
  {
    role: "Ministra do Trabalho, Solidariedade e Segurança Social",
    name: "Maria do Rosário Ramalho",
    party: "Independente",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063797.jpg",
    icon: Users,
  },
  {
    role: "Ministra do Ambiente e Energia",
    name: "Maria da Graça Carvalho",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063798.jpg",
    icon: Zap,
  },
  {
    role: "Ministra da Cultura, Juventude e Desporto",
    name: "Margarida Balseiro Lopes",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063799.jpg",
    icon: GraduationCap,
  },
  {
    role: "Ministro da Agricultura e Mar",
    name: "José Manuel Fernandes",
    party: "PSD",
    photoUrl: "https://www.portugal.gov.pt/upload/imagens/i063800.jpg",
    icon: TreePine,
  },
];

const MemberCard = ({ member, isPM = false }: { member: Member; isPM?: boolean }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
  };

  const getCardStyles = () => {
    if (isPM) {
      return {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%)",
        border: "2px solid rgba(212, 175, 55, 0.5)",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        hoverShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)"
      };
    } else if (member.isStateMinister) {
      return {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.04) 100%)",
        border: "1px solid rgba(156, 163, 175, 0.4)",
        shadow: "0 6px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        hoverShadow: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
      };
    } else {
      return {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)",
        border: "1px solid rgba(156, 163, 175, 0.3)",
        shadow: "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        hoverShadow: "0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
      };
    }
  };

  const styles = getCardStyles();

  return (
    <motion.div
      variants={cardVariants}
      className={`relative group rounded-none transition-all duration-500 backdrop-blur-xl ${isPM ? 'w-full max-w-md' : 'w-72'}`}
      style={{
        background: styles.background,
        border: styles.border,
        boxShadow: styles.shadow,
      }}
      whileHover={{ 
        y: -4, 
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => {
        const element = document.querySelector(`[data-member="${member.name}"]`) as HTMLElement;
        if (element) {
          element.style.boxShadow = styles.hoverShadow;
        }
      }}
      onHoverEnd={() => {
        const element = document.querySelector(`[data-member="${member.name}"]`) as HTMLElement;
        if (element) {
          element.style.boxShadow = styles.shadow;
        }
      }}
      data-member={member.name}
    >
      {/* Official header bar */}
      {isPM && (
        <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/15 border-b border-yellow-400/30 px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-yellow-200">
            <Crown className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Chefe do Governo</span>
          </div>
        </div>
      )}
      
      {/* Card content */}
      <div className={`relative ${isPM ? 'p-8' : 'p-6'} text-center`}>
        {/* Official photo with formal styling */}
        <div className="mb-6 relative">
          <div className={`relative ${isPM ? "w-40 h-48" : "w-32 h-40"} mx-auto`}>
            <div className={`relative border-2 ${
              isPM ? 'border-yellow-400/40' : 'border-gray-400/30'
            } overflow-hidden`}>
              <Image
                src={member.photoUrl}
                alt={member.name}
                width={isPM ? 160 : 128}
                height={isPM ? 192 : 160}
                className="w-full h-full object-cover"
              />
              {/* Official overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Official name and title */}
        <div className="mb-4">
          <h2 className={`font-bold text-white mb-2 ${isPM ? "text-xl" : "text-lg"} tracking-tight`}>
            {member.name}
          </h2>
          <div className={`text-xs mb-2 font-medium uppercase tracking-wider min-h-[2.5rem] flex items-center justify-center ${
            isPM ? "text-yellow-200" : 
            member.isStateMinister ? "text-gray-300" : 
            "text-gray-400"
          }`}>
            {member.role}
          </div>
        </div>

        {/* Official party affiliation */}
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={`text-xs font-semibold px-3 py-1 rounded-none border backdrop-blur-sm ${
              member.party === 'PSD' ? 
                'border-orange-400/40 text-orange-200 bg-orange-500/15' :
              member.party === 'CDS-PP' ? 
                'border-blue-400/40 text-blue-200 bg-blue-500/15' :
                'border-gray-400/40 text-gray-200 bg-gray-500/15'
            }`}
          >
            {member.party}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default function GovernmentStructurePage() {
  const primeMinister = governmentMembers[0];
  const stateMinisters = governmentMembers.filter(m => m.isStateMinister);
  const regularMinisters = governmentMembers.filter(m => m.role !== 'Primeiro-Ministro' && !m.isStateMinister);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b17] via-[#111936] to-[#0c1023] text-white overflow-hidden">
      <div className="container relative z-10 mx-auto p-6 pt-24 pb-32">
        {/* Government Information */}
        <div className="border-b border-white/10">
          <div className="container py-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Governo Português</h1>
              <p className="text-gray-400">
                XXV Governo Constitucional • Palácio de São Bento, Lisboa
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-20 mt-16">
          {/* Prime Minister Section */}
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Primeiro-Ministro</h2>
              <p className="text-gray-400 text-sm">Chefe do Governo da República Portuguesa</p>
            </motion.div>
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-md"
              >
                <MemberCard member={primeMinister} isPM={true} />
              </motion.div>
            </div>
          </section>

          {/* State Ministers Section */}
          {stateMinisters.length > 0 && (
            <section>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ministros de Estado</h2>
                <p className="text-gray-400 text-sm">Ministros com competências especiais e coordenação transversal</p>
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {stateMinisters.map(member => (
                  <MemberCard key={member.name} member={member} />
                ))}
              </motion.div>
            </section>
          )}

          {/* Regular Ministers Section */}
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Ministros</h2>
              <p className="text-gray-400 text-sm">Membros do Conselho de Ministros responsáveis pelos respetivos ministérios</p>
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-8 justify-center max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {regularMinisters.map(member => (
                <MemberCard key={member.name} member={member} />
              ))}
            </motion.div>
          </section>
        </div>

      </div>
    </div>
  )
}
