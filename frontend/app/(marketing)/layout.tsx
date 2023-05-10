import Link from "next/link";

import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import MainLayoutComponent from "./mainLayoutComponent";
import { gqlClient } from "@/lib/gql_client_server";
import { MeDocument } from "@/gql/graphql";
import me from "@/lib/me";

interface MarketingLayoutProps {
	children: React.ReactNode;
}



export default async function MainLayout({ children }: MarketingLayoutProps) {
	const user = await me();
	return (
		<AuthProvider initialUser={user}>
			<MainLayoutComponent>{children}</MainLayoutComponent>
		</AuthProvider>
	);
}
