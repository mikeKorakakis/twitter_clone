import { SiteConfig } from "../types";

export const siteConfig: SiteConfig = {
    name: "Twitter Clone",
	description:
    "An open source application built using the new router, server components and everything new in Next.js 13.",
	url: "https://twitter.korakakis.com",
	// ogImage: "https://tx.shadcn.com/og.jpg",
	links: {
        github: "https://github.com/mikeKorakakis/twitter_clone",
	},
	pages: {
        home: "/",
		login: "/login",
		register: "/register",
        forgotPassword: "/account/forgot-password",
        resetPassword: "/account/reset-password",
        dashboard: "/dashboard",
        profile: "/dashboard/settings",
        posts: "/posts",
        dashboardPosts: "/dashboard/posts"
	},
    defaultPageSize: 4,
};
