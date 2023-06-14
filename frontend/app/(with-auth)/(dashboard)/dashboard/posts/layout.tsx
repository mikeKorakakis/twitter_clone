'use client'
import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
// import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardPostsLayout({
	children,
}: DashboardLayoutProps) {
	
	return (
		<>{children}</>
	);
}
