import { Navbar } from '@/components/Navbar';
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
      >
        <div className="flex flex-col">
          <Navbar />

        {children}
        </div>
      </body>
    </html>
  );
}
