import { SiteConfig } from "../types";

export const siteConfig: SiteConfig = {
	name: "Twitter Clone",
	description:
		"An open source application built using the new router, server components and everything new in Next.js 13.",
	url: "https://tx.shadcn.com",
	ogImage: "https://tx.shadcn.com/og.jpg",
	links: {
		twitter: "https://twitter.com/shadcn",
		github: "https://github.com/shadcn/taxonomy",
	},
	pages: {
		home: "/",
		login: "/login",
		register: "/register",
        forgotPassword: "/account/forgot-password",
        resetPassword: "/account/reset-password",
	},
};
