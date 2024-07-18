import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/provider/NextAuthProvider";
import UiProvider from "@/provider/UiProvider";
import "@/assets/css/globals.css";
import { TanstackProvider } from "@/provider/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "backoffice Admin by Next.js",
  description: "Created Using Next.js 14 and Next UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <TanstackProvider>
          <NextAuthProvider>
            <UiProvider>
              <main className="dark text-foreground bg-background">
                {children}
              </main>
            </UiProvider>
          </NextAuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
