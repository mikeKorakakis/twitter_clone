"use client";
import { redirect, useSearchParams } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItemPublic } from "@/components/post-item-public";
import { DashboardShell } from "@/components/shell";
import { useAuth } from "@/contexts/AuthContext";
import { gqlClient } from "@/lib/client";
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

interface PostsPageParams {
	params: {
		page: string;
	};
}

export default async function PostsPage({ params }: PostsPageParams) {
	//   const { user } = useAuth()

	//   if (!user) {
	//     redirect(authOptions?.pages?.signIn || "/login")
	//   }
	const searchParams = useSearchParams();
	let pageSize = siteConfig.defaultPageSize;
	const pageS = searchParams.get("pageSize");
	if (pageS && !isNaN(parseInt(pageS))) pageSize = parseInt(pageS);

	// const pageSize = searchParams?.pageSize ? parseInt(searchParams.pageSize) : 4
	const pageNum = params?.page ? parseInt(params.page) : 1;
	const client = await gqlClient();
	const postsRes = await client.request<
		GetPostsQuery,
		GetPostsQueryVariables
	>(GetPostsDocument, {
		args: {
			take: pageSize,
			page: pageNum,
		},
	});
	const posts = postsRes.posts.data;
	const meta = postsRes.posts.meta;
	//   const posts = [{id: "1", title: "test", published: true, createdAt: new Date("2021-08-01")}]

	//   const post = gqlClient.request<>(getPostQuery)

	//   const posts = await db.post.findMany({
	//     where: {
	//       authorId: user.id,
	//     },
	//     select: {
	//       id: true,
	//       title: true,
	//       published: true,
	//       createdAt: true,
	//     },
	//     orderBy: {
	//       updatedAt: "desc",
	//     },
	//   })

	return (
		<DashboardShell>
			<DashboardHeader heading="Posts" text="Create and manage posts.">
				<PostCreateButton />
			</DashboardHeader>
			<Pagination
				pageIndex={pageNum}
				totalPages={meta?.pageCount}
				pageSize={pageSize}
				hasNextPage={meta?.hasNextPage}
				hasPreviousPage={meta?.hasPreviousPage}
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
