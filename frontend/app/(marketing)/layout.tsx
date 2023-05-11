"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MainNav } from "@/components/main-nav";
import { marketingConfig } from "@/config/marketing";
// import { useRouter } from "next/navigation";

interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default function MainLayout({ children }: MarketingLayoutProps) {
	const { user, logOut } = useAuth();
	// const router = useRouter();
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
						{!user ? (
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
						) : (
							<button
								// href="/login"
								onClick={logOut}
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
						)}
					</nav>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			{/* <SiteFooter /> */}
		</div>
	);
}
