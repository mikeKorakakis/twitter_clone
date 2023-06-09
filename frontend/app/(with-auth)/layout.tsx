import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import { Analytics } from "@/components/analytics";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { AuthProvider } from "@/contexts/AuthContext";
import me from "@/lib/me";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { MeQuery, MeQueryVariables, MeDocument } from "@/gql/graphql";
import { gqlClient } from "@/lib/gql_client_server";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
	src: "../../assets/fonts/CalSans-SemiBold.woff2",
	variable: "--font-heading",
});

interface RootLayoutProps {
	children: React.ReactNode;
}

export const metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		"Next.js",
		"React",
		"Tailwind CSS",
		"Server Components",
		"Radix UI",
	],
	authors: [
		{
			name: "shadcn",
			url: "https://shadcn.com",
		},
	],
	creator: "shadcn",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [`${siteConfig.url}/og.jpg`],
		creator: "@shadcn",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
	manifest: `${siteConfig.url}/site.webmanifest`,
};
export default async function Layout({ children }: RootLayoutProps) {
	const user = await me();

	console.log("user in root layout", user);
	return <AuthProvider initialUser={user}>{children}</AuthProvider>;
}
