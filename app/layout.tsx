import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Futuristic Image Gallery",
  description: "A secure and futuristic image gallery with authentication",
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

