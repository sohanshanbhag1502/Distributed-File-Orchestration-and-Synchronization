import { Inter } from "next/font/google";
import "@/app/globals.css";
import NotiFier from "@/components/NotiFier";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "File Manager",
    icons: "/icon.png",
    description: "A Home to your files",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NotiFier>
                {children}
                </NotiFier>
            </body>
        </html>
    );
}