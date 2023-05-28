import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { useAuth } from "@/contexts/AuthContext"
import { gqlClient } from "@/lib/gql_client_server"
import { GetPostsDocument, GetPostsQuery } from "@/gql/graphql"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
//   const { user } = useAuth()

//   if (!user) {
//     redirect(authOptions?.pages?.signIn || "/login")
//   }
  const client = await gqlClient()
  const postsRes = await client.request<GetPostsQuery>(GetPostsDocument)
  const posts = postsRes.posts
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
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
