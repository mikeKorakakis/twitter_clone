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
	const { user } =  useAuth();
	if (!user) {
		redirect(siteConfig.pages.login)
	}
	return (
        
		<div className="flex min-h-screen flex-col space-y-6">
			<div className="container grid flex-1 gap-12 ">
				{/* <aside className="hidden w-[200px] flex-col md:flex">
					<DashboardNav items={dashboardConfig.sidebarNav} />
				</aside> */}
				<section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
					<main className="flex w-full flex-1 flex-col overflow-hidden">
						{children}
					</main>
				</section>
			</div>
			<SiteFooter className="border-t" />
		</div>
	);
}
