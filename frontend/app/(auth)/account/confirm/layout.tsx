"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MainNav } from "@/components/main-nav";
import { marketingConfig } from "@/config/marketing";
// import { useRouter } from "next/navigation";

interface MainLayoutProps {
	children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
	const { user, logOut } = useAuth();
	// const router = useRouter();
	return (
		<div className="flex  flex-col h-[calc(100vh-80px)]">
			<header className="container z-40 bg-background">
				<div className="flex h-20 items-center justify-between py-6">
					<MainNav items={marketingConfig.mainNav} />
					{user?.displayName && (
						<div className="flex items-center space-x-4">
							{user?.displayName}
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
			<main className="flex-1 flex items-center justify-center h-full">{children}</main>
			{/* <SiteFooter /> */}
		</div>
	);
}
