// app/layout.tsx
import Link from "next/link";
import SessionWrapper from "@/components/SessionWrapper";
import AuthButton from "@/components/AuthButton";
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionWrapper>
          <header className="navbar">
            <div className="nav-container">
               {/*... votre logo ... */}
               <AuthButton />
            </div>
          </header>
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  )
}

