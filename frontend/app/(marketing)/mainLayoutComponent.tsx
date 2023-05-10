'use client'
import Link from "next/link";

import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/contexts/AuthContext";

interface MarketingLayoutProps {
	children: React.ReactNode;
}

const MainLayoutComponent = ({ children }: MarketingLayoutProps) => {
	const { initialUser: user } = useAuth();
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
					</nav>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</div>
	);
};

export default MainLayoutComponent;
