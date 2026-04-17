// src/app/layout.tsx
import ClientLayout from "./clientLayout";

export const metadata = {
  title: "InvestorEye",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
  description: "Investment insights and analytics platform",
  openGraph: {
    title: "InvestorEye",
    description: "Investment insights and analytics platform",
    url: "https://investoreye.vercel.app/",
    siteName: "InvestorEye",
    // images: [
    //   {
    //     url: "https://investoreye.vercel.app/preview.png",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    images: ["/preview.png"], // cleaner

    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InvestorEye",
    description: "Investment insights and analytics platform",
    // images: ["https://investoreye.vercel.app/preview.png"],
    images: ["/preview.png"], // cleaner
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
