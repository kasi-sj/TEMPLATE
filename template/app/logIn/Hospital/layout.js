import '../../globals.css'
import ResponsiveAppBar from '@/components/NavBar'
export default function RootLayout({ children }) {
  return (
      <div className='flex justify-center h-screen'>
        <div>
            {children}
        </div>
      </div>
  )
}
