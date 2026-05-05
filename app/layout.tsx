// app/layout.tsx
import Link from "next/link";
import "./globals.css";
export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="fr">
      <body>
        
        <header className="header">
          <nav className="nav">
            
            <Link href="/" className="logo">
              🔗 LinkUp
            </Link>

            <Link href="/" className="nav-link">
              Accueil
            </Link>
            
            <Link href="/explore" className="nav-link">
              Explorer
            </Link>
            
            <Link href="/profile" className="nav-link">
              Mon profil
            </Link>
            
          </nav>
        </header>

        <main>
          {children}
        </main>

      </body>
    </html>
 );
}

