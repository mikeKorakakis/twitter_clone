
import { redirect } from "next/navigation";

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItem } from "@/components/post-item";
import { DashboardShell } from "@/components/shell";
import { useAuth } from "@/contexts/AuthContext";
import { gqlClient } from "@/lib/gql_client_server";
import {
	GetUserPostsDocument,
	GetUserPostsQuery,
	GetUserPostsQueryVariables,
} from "@/gql/graphql";
import { Pagination } from "@/components/pagination";
import { siteConfig } from "@/config/site"

export const metadata = {
	title: "Dashboard Posts",
};

export default async function DashboardPage() {
	//   const { user } = useAuth()

	//   if (!user) {
	//     redirect(authOptions?.pages?.signIn || "/login")
	//   }
	const client = await gqlClient();
	const postsRes = await client.request<
		GetUserPostsQuery,
		GetUserPostsQueryVariables
	>(GetUserPostsDocument, {
		args: {
			take: 4,
			page: 1,
		},
	});
	const posts = postsRes.userPosts.data;
	const meta = postsRes.userPosts.meta;
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
			<div>
                <div className="pb-4">
				<Pagination
					pageIndex={1}
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
