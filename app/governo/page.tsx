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
  Icon
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
    name: "Maria do Rosário Palma Ramalho",
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
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.05) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        shadow: "0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        hoverShadow: "0 12px 40px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
      };
    } else if (member.isStateMinister) {
      return {
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 50%, rgba(180, 83, 9, 0.05) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        shadow: "0 8px 32px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        hoverShadow: "0 12px 40px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
      };
    } else {
      return {
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.02) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        hoverShadow: "0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
      };
    }
  };

  const styles = getCardStyles();

  return (
    <motion.div
      variants={cardVariants}
      className={`relative group rounded-2xl transition-all duration-500 backdrop-blur-xl ${isPM ? 'w-full max-w-sm' : 'w-80'}`}
      style={{
        background: styles.background,
        border: styles.border,
        boxShadow: styles.shadow,
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => {
        // Dynamic shadow on hover via inline styles for more control
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
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Card content */}
      <div className="relative p-8 text-center">
        {/* Photo container with enhanced styling */}
        <div className="mb-6 relative">
          <div className={`relative ${isPM ? "w-44 h-52" : "w-36 h-44"} mx-auto`}>
            {/* Photo background glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
              isPM ? 'from-blue-400/20 to-blue-600/10' :
              member.isStateMinister ? 'from-amber-400/20 to-amber-600/10' :
              'from-white/10 to-gray-400/5'
            } blur-xl`} />
            
            {/* Photo frame */}
            <div className={`relative rounded-2xl p-1 ${
              isPM ? 'bg-gradient-to-br from-blue-400/30 to-blue-600/20' :
              member.isStateMinister ? 'bg-gradient-to-br from-amber-400/30 to-amber-600/20' :
              'bg-gradient-to-br from-white/20 to-gray-400/10'
            }`}>
              <Image
                src={member.photoUrl}
                alt={member.name}
                width={isPM ? 160 : 130}
                height={isPM ? 190 : 160}
                className="w-full h-full rounded-xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Name with enhanced typography */}
        <h2 className={`font-bold text-white mb-3 ${isPM ? "text-2xl" : "text-xl"} tracking-tight`}>
          {member.name}
        </h2>

        {/* Role with subtle styling */}
        <div className={`text-sm mb-6 font-medium font-inter ${
          isPM ? "text-blue-200" : 
          member.isStateMinister ? "text-amber-200" : 
          "text-gray-200"
        }`}>
          {member.role}
        </div>

        {/* Party badge with enhanced styling */}
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={`text-sm font-semibold px-4 py-2 rounded-full border backdrop-blur-sm ${
              member.party === 'PSD' ? 
                'border-orange-400/50 text-orange-200 bg-orange-500/20 shadow-lg shadow-orange-500/20' :
              member.party === 'CDS-PP' ? 
                'border-blue-400/50 text-blue-200 bg-blue-500/20 shadow-lg shadow-blue-500/20' :
                'border-gray-400/50 text-gray-200 bg-gray-500/20 shadow-lg shadow-gray-500/20'
            }`}
          >
            {member.party}
          </Badge>
        </div>
      </div>

      {/* Bottom subtle highlight */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
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
        staggerChildren: 0.05,
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
              <h1 className="text-3xl font-bold tracking-tight">Composição do Governo</h1>
              <p className="text-muted-foreground">
                XXV Governo Constitucional de Portugal
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-16 mt-12">
          {/* Prime Minister Section */}
          <section className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-sm"
            >
              <MemberCard member={primeMinister} isPM={true} />
            </motion.div>
          </section>

          {/* State Ministers Section */}
          {stateMinisters.length > 0 && (
            <section>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-yellow-300 text-center mb-8"
              >
                Ministros de Estado
              </motion.h2>
              <motion.div
                className="flex flex-wrap gap-8 justify-center"
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
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-blue-300 text-center mb-8"
            >
              Ministros
            </motion.h2>
            <motion.div
              className="flex flex-wrap gap-8 justify-center"
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
