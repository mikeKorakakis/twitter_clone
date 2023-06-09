import { redirect } from "next/navigation";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItemPublic } from "@/components/post-item-public";
import { DashboardShell } from "@/components/shell";
import { useAuth } from "@/contexts/AuthContext";
import { gqlClient } from "@/lib/gql_client_server";
import {
	GetPostsDocument,
	GetPostsQuery,
	GetPostsQueryVariables,
} from "@/gql/graphql";
import { useState } from "react";
import { Pagination } from "@/components/pagination";
import { siteConfig } from "@/config/site";

export const metadata = {
	title: "Posts",
};

export default async function PostsPage() {
	//   const { user } = useAuth()

	//   if (!user) {
	//     redirect(authOptions?.pages?.signIn || "/login")
	//   }
	const client = await gqlClient();
	const postsRes = await client.request<
		GetPostsQuery,
		GetPostsQueryVariables
	>(GetPostsDocument, {
		args: {
			take: 4,
			page: 1,
		},
	});
	const posts = postsRes.posts.data;
	const meta = postsRes.posts.meta;

	return (
		<DashboardShell>
			<DashboardHeader heading="Posts" text="Create and manage posts.">
				<PostCreateButton />
			</DashboardHeader>
			<Pagination
				pageIndex={1}
				totalPages={meta?.pageCount}
				pageSize={meta?.take}
				hasNextPage={meta?.hasNextPage}
				hasPreviousPage={meta?.hasPreviousPage}
				rootPage={siteConfig.pages.posts}
			/>
			<div>
				{posts?.length ? (
					<div>
						{/* <div className="divide-y divide-border rounded-md border"> */}
						{posts.map((post) => (
							<PostItemPublic key={post.id} post={post} />
						))}
					</div>
				) : (
					<EmptyPlaceholder>
						<EmptyPlaceholder.Icon name="post" />
						<EmptyPlaceholder.Title>
							No posts created
						</EmptyPlaceholder.Title>
						<EmptyPlaceholder.Description>
							You don&apos;t have any posts yet. Start creating
							content.
						</EmptyPlaceholder.Description>
						<PostCreateButton variant="outline" />
					</EmptyPlaceholder>
				)}
			</div>
		</DashboardShell>
	);
}
