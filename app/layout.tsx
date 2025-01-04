import { Navbar } from '@/components/Navbar';
import './globals.css'
import "@radix-ui/themes/styles.css";
import { Theme } from '@radix-ui/themes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
      >
        <Theme>

          <div className="flex flex-col">
            <Navbar />

            {children}
          </div>
        </Theme>
      </body>
    </html>
  );
}
