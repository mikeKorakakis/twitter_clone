// 'use client'
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { Editor } from "@/components/editor";
import { gqlClient } from "@/lib/gql_client_server";
import {
	GetPostDocument,
	GetPostQuery,
	GetPostQueryVariables,
} from "@/gql/graphql";

// async function getPostForUser(postId: Post["id"], userId: User["id"]) {
//   return await db.post.findFirst({
//     where: {
//       id: postId,
//       authorId: userId,
//     },
//   })
// }

async function getPost(id: string) {
    const client = await gqlClient()
	const response = await client.request<
		GetPostQuery,
		GetPostQueryVariables
	>(GetPostDocument, { id });
	return response?.post;
}

interface EditorPageProps {
	params: { postId: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
	//   const user = await getCurrentUser()
	const post = await getPost(params.postId);
    
	if (!post) {
		notFound();
	}


	return (
		<Editor
			post={{
				id: post.id,
				title: post.title,
				content: post.content,
				published: post.published,
			}}
		/>
	);
}
