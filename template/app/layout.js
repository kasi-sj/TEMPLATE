import './globals.css'
import ResponsiveAppBar from '@/components/NavBar'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <ResponsiveAppBar/>
        {children}
      </body>
    </html>
  )
}

