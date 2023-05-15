"use client";

import MainLayout from "@/components/main-layout";

interface MainLayoutProps {
	children: React.ReactNode;
}

export default function MainLayoutPage({ children }: MainLayoutProps) {
	return <MainLayout>{children}</MainLayout>;
}
