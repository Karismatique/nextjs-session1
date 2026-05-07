// app/layout.tsx
import SessionWrapper from '@/components/SessionWrapper'
import AuthButton from '@/components/AuthButton'      
import Link from 'next/link' 
import './globals.css'                                 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr"> 
      <body>
        <SessionWrapper> 
          <header className="navbar" style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6d28d9', textDecoration: 'none' }}>
                LinkUp
              </Link>
              
              <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link href="/explore" style={{ color: '#374151', textDecoration: 'none' }}>Explorer</Link>
                <Link href="/profile" style={{ color: '#374151', textDecoration: 'none' }}>Mon Profil</Link>
                
                <AuthButton /> 
              </nav>
            </div>
          </header>

          <main>
            {children} 
          </main>
        </SessionWrapper>
      </body>
    </html>
  )
}