"use client";
import './globals.css'
import { ThemeProvider } from "@material-tailwind/react";
import ResponsiveAppBar from '@/components/NavBar'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <ResponsiveAppBar/>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

