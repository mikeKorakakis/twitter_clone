"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { gqlClient } from "@/lib/client";
import {
	GetUserPostsDocument,
	GetUserPostsQuery,
	GetUserPostsQueryVariables,
} from "@/gql/graphql";

interface PostCreateButtonProps extends ButtonProps {}

export function PostCreateButton({
	className,
	variant,
	...props
}: PostCreateButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onClick() {
		setIsLoading(true);

		const client = await gqlClient();
		// return res;
		const response = await client.request<
			GetUserPostsQuery,
			GetUserPostsQueryVariables
		>(GetUserPostsDocument,{
            args: {
                take: 4,
                page: 1,
            }
        });

		// const response = await fetch("/api/posts", {
		//   method: "POST",
		//   headers: {
		//     "Content-Type": "application/json",
		//   },
		//   body: JSON.stringify({
		//     title: "Untitled Post",
		//   }),
		// })

		setIsLoading(false);

		if (!response?.userPosts) {
			// if (response.status === 402) {
			// 	return toast({
			// 		title: "Limit of 3 posts reached.",
			// 		description: "Please upgrade to the PRO plan.",
			// 		variant: "destructive",
			// 	});
			// }
			if (response?.userPosts?.meta?.itemCount && response?.userPosts?.meta?.itemCount > 3) {
				return toast({
					title: "Something went wrong.",
					description:
						"You have reached the maximum number of posts. Please upgrade to the PRO plan.",
					variant: "destructive",
				});
			} else {
			}
		}

		// const post = await response.json();

		// This forces a cache invalidation.
		router.refresh();
		router.push("/editor");
	}

	return (
		<button
			onClick={onClick}
			className={cn(
				buttonVariants({ variant }),
				{
					"cursor-not-allowed opacity-60": isLoading,
				},
				className
			)}
			disabled={isLoading}
			{...props}
		>
			{isLoading ? (
				<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<Icons.add className="mr-2 h-4 w-4" />
			)}
			New post
		</button>
	);
}
