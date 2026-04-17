// src/app/layout.tsx
import ClientLayout from "./clientLayout";

export const metadata = {
  title: "InvestorEye",
  description: "Investment insights and analytics platform",
  openGraph: {
    title: "InvestorEye",
    description: "Investment insights and analytics platform",
    url: "https://investoreye.vercel.app/",
    siteName: "InvestorEye",
    images: [
      {
        url: "https://investoreye.vercel.app/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestorEye",
    description: "Investment insights and analytics platform",
    images: ["https://investoreye.vercel.app/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
