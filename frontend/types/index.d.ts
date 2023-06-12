// import { User } from "@prisma/client";
import { User } from "@/gql";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/icons";

type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>


export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};

export type MainNavItem = NavItem;

export type UserType = OptionalExceptFor<
	User,
	"id" | "email" | "firstName" | "lastName" | "role" | "displayName" | "image" 
>;

export type SidebarNavItem = {
	title: string;
	disabled?: boolean;
	external?: boolean;
	icon?: keyof typeof Icons;
} & (
	| {
			href: string;
			items?: never;
	  }
	| {
			href?: string;
			items: NavLink[];
	  }
);

export type SiteConfig = {
	name: string;
	description: string;
	url: string;
	ogImage: string;
	links: {
		github: string;
	};
	pages: {
		[key: string]: string;
	};
	defaultPageSize: number;
};

export type DocsConfig = {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
};

export type HomeConfig = {
	mainNav: MainNavItem[];
	authNav: MainNavItem[];
};

export type DashboardConfig = {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
	name: string;
	description: string;
	stripePriceId: string | null;
};

export type UserSubscriptionPlan = SubscriptionPlan &
	Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
		stripeCurrentPeriodEnd: number;
		isPro: boolean;
	};
