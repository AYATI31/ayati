import type { Metadata } from "next";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { LocalDemoDataReset } from "@/components/LocalDemoDataReset";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ayati.example"),
  title: {
    default: "AYATI Healthcare Navigation",
    template: "%s | AYATI"
  },
  description:
    "AYATI helps UAE patients, caregivers, and clinics coordinate healthcare navigation with clear next steps.",
  openGraph: {
    title: "AYATI Healthcare Navigation",
    description:
      "A concierge-style healthcare navigation platform for patient journeys, caregiver coordination, and clinic operations.",
    images: ["/images/ayati-discover-hero.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <LocalDemoDataReset />
        <AppHeader />
        <main>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}
