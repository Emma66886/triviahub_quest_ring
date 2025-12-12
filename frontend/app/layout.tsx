import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletContextProvider } from "./components/WalletContextProvider";
import { AuthProvider } from "./components/AuthContext";
import { SoundProvider } from "./components/SoundContext";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quest Ring - Learn Solana Development",
  description: "A gamified platform to transform beginners into competent Solana developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} antialiased bg-gray-900 text-white font-sans`}
      >
        <WalletContextProvider>
          <AuthProvider>
            <SoundProvider>
              {children}
            </SoundProvider>
          </AuthProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
