"use client"
import { redirect, useSearchParams } from "next/navigation";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItem } from "@/components/post-item";
import { DashboardShell } from "@/components/shell";
import { gqlClient } from "@/lib/client";
import {
	GetUserPostsDocument,
	GetUserPostsQuery,
	GetUserPostsQueryVariables,
} from "@/gql/graphql";
import { Pagination } from "@/components/pagination";
import { siteConfig } from "@/config/site";


// export const metadata = {
// 	title: "Dashboard",
// };

interface PageParams {
	params: { page: string };
}

export default async function DashboardPostsPage({ params }: PageParams) {
	const searchParams = useSearchParams();
	let pageSize = siteConfig.defaultPageSize;
	const pageS = searchParams.get("pageSize");
	if (pageS && !isNaN(parseInt(pageS))) pageSize = parseInt(pageS);

	const pageIndex = params?.page ? parseInt(params?.page) : 1;
	const client = await gqlClient();
	const postsRes = await client.request<
		GetUserPostsQuery,
		GetUserPostsQueryVariables
	>(GetUserPostsDocument, {
		args: {
			take: pageSize,
			page: pageIndex,
		},
	});
	const posts = postsRes.userPosts.data;
	const meta = postsRes.userPosts.meta;
	

	return (
		<DashboardShell>
			<DashboardHeader heading="Posts" text="Create and manage posts.">
				<PostCreateButton />
			</DashboardHeader>
			<div>
				<div className="pb-4">
					<Pagination
						pageIndex={pageIndex}
						totalPages={meta?.pageCount}
						pageSize={meta?.take}
						hasNextPage={meta?.hasNextPage}
						hasPreviousPage={meta?.hasPreviousPage}
                        rootPage={siteConfig.pages.dashboardPosts}
					/>
				</div>
				{posts?.length ? (
					<div className="divide-y divide-border rounded-md border">
						{posts.map((post) => (
							<PostItem key={post.id} post={post} />
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
