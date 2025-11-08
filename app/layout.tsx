import "./globals.css";
import type { Metadata } from "next";


export const metadata: Metadata = {
title: "Performance Dashboard",
description: "60fps real-time charts (Next.js 14)",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="bg-neutral-950 text-neutral-100">
{children}
</body>
</html>
);
}