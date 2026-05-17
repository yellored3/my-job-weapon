import type { Metadata } from "next";
import "./globals.css";
import { JobWeaponProvider } from "@/context/JobWeaponContext";

export const metadata: Metadata = {
  title: "나만의 취업 무기 제작소",
  description: "나의 직업 가치관, 일의 의미, 벨빈 역할을 조합하여 나만의 취업 무기를 만드세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" as="style" />
      </head>
      <body className="min-h-[100dvh] flex flex-col">
        <JobWeaponProvider>
          <div className="flex-grow flex flex-col items-center justify-center w-full">
            {children}
          </div>
        </JobWeaponProvider>
      </body>
    </html>
  );
}
