"use client";
import { redirect } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
// import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site";
import { homeConfig } from "@/config/home";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
	children?: React.ReactNode;
}

export default async function DashboardLayout({
	children,
}: DashboardLayoutProps) {
	const { user } = await useAuth();

	if (!user) {
		redirect(siteConfig.pages.login);
	}

	return (
		<div className="flex min-h-screen flex-col space-y-6">
			<header className="sticky top-0 z-40 border-b bg-background">
				<div className="container flex h-16 items-center justify-between py-4">
					<MainNav items={homeConfig.mainNav} />
					<UserAccountNav
						user={{
							displayName: user.displayName,
							image: user.image,
							email: user.email,
						}}
					/>
				</div>
			</header>
			<div className="space-y-6 p-10 pb-16 block">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">
						Settings
					</h2>
					<p className="text-muted-foreground">
						Manage your account settings and set e-mail preferences.
					</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">
					<DashboardNav items={dashboardConfig.sidebarNav} />
					</aside>
					<div className="flex-1 lg:max-w-2xl">{children}</div>
				</div>
			</div>
			{/* <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="hidden w-[200px] flex-col md:flex">
					<DashboardNav items={dashboardConfig.sidebarNav} />
				</aside>
				<main className="flex w-full flex-1 flex-col overflow-hidden">
					{children}
				</main>
			</div> */}
			<SiteFooter className="border-t" />
		</div>
	);
}
