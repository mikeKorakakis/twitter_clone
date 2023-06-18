"use client";
import { notFound, redirect } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
// import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site";

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const { user } = useAuth();
	if (!user) redirect(siteConfig.pages.login);
	return <div>{children}</div>;
}
