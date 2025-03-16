import type React from "react"
import "/styles/globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from 'react-hot-toast'
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: 'Bizen MDHR | Gallery',
    template: '%s | Bizen MDHR | Gallery', // For dynamic titles in child pages
    absolute: 'Bizen MDHR | Gallery'
  },
  description: 'Auth Family Gallery - A premier online gallery showcasing stunning artworks and photography. Featuring a curated collection of masterpieces, we specialize in digital exhibitions, custom art displays, and immersive visual experiences.',
  keywords: [
    'bizen mdhr family gallery',
    'bizen mdhr family art collection',
    'bizen mdhr family photography',
    'bizen mdhr family exhibition',
    'bizen mdhr family digital gallery',
    'bizen mdhr family heritage art',
    'bizen mdhr family legacy gallery',
    'bizen mdhr family authentic family portraits',
    'bizen mdhr family ancestral art collection',
    'bizen mdhr family family history through art',
    'bizen mdhr family family storytelling through art',
    'bizen mdhr family authentic cultural gallery',
    'bizen mdhr family generational art showcase',
    'bizen mdhr family artistic family legacy',
],
authors: [{ name: 'Bizen Mdhr', url: 'https://gallery.bizendra.com.np' }],
robots: {
  index: true,
  follow: true,
},
openGraph: {
  title: 'Bizen Mdhr Gallery',
  description: 'Bizen Mdhr Gallery - A curated collection of family-inspired artworks and photography. Showcasing heritage, culture, and storytelling through visual art in Nepal.',
  url: 'https://gallery.bizendra.com.np',
  siteName: 'Bizen Mdhr Gallery | Art & Photography Nepal',
  images: [
    {
      url: './gallery-thumbnail.png', // Path to your OG image
      width: 800,
      height: 600,
    }
  ],
  locale: 'en-US',
  type: 'website',
},
manifest: '/site.webmanifest',
icons: {
  icon: './favicon-32x32.png',
  apple: './apple-touch-icon.png',
  other: {
    rel: 'icon',
    url: './favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bizen MDHR | Gallery',
    description: 'Bizen MDHR Gallery - A curated collection of family-inspired artworks and photography. Showcasing heritage, culture, and storytelling through visual art in Nepal.',
    images: ['./gallery-thumbnail.png'], // Path to your Twitter image
  },
},

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'rgba(31, 41, 55, 0.9)',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px 24px',
                border: '1px solid rgba(21, 215, 92, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 30px rgba(34, 197, 94, 0.1)',
                letterSpacing: '0.5px',
              },
              success: {
                style: {
                  borderColor: 'rgba(34, 197, 94, 0.5)',
                  boxShadow: '0 4px 30px rgba(34, 197, 94, 0.2)',
                },
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  borderColor: 'rgba(42, 204, 50, 0.5)',
                  boxShadow: '0 4px 30px rgba(19, 205, 28, 0.2)',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}

