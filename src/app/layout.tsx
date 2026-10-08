import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FELICI-IÁ | Organize hoje. Construa seu amanhã.",
  description: "Chatbot gamificado e educação financeira com lógica Down-Top para Jovens Aprendizes do Senac.",
  icons: {
    icon: "/logo-feliciia.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <div className="mx-auto flex min-h-screen max-w-md flex-col relative pb-20 shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
