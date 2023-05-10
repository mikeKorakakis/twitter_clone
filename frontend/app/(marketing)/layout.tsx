"use client";
import Link from "next/link";

import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { gqlClient } from "@/lib/gql_client_server";
import { MeDocument } from "@/gql/graphql";
import me from "@/lib/me";
import { use } from "react";
import { useRouter } from "next/navigation";

interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default async function MainLayout({ children }: MarketingLayoutProps) {
	const { user, logOut } = useAuth();
	const router = useRouter();
	console.log("dfds");
	return (
		<div className="flex min-h-screen flex-col">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<MainNav items={marketingConfig.mainNav} />
					{user?.email && (
						<div className="flex items-center space-x-4">
							{user?.email}
						</div>
					)}
					<nav>
						
							<Link
								href="/login"
								className={cn(
									buttonVariants({
										variant: "secondary",
										size: "sm",
									}),
									"px-4"
								)}
							>
								Login
							</Link>
							<button
								// href="/login"
								onClick={async () => {
									await logOut();
									router.push("/");
								}}
								className={cn(
									buttonVariants({
										variant: "secondary",
										size: "sm",
									}),
									"px-4"
								)}
							>
								Logout
							</button>
						
					</nav>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
}
