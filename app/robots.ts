import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/deputados', 
        '/estatisticas',
        '/sobre'
      ],
    },
    sitemap: 'https://veto.pt/sitemap.xml',
  }
} 