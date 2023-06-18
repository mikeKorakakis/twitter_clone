"use client";
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PostOperations } from "@/components/post-operations";
import { GetPostQuery, GetPostsQuery, Post, User } from "@/gql/graphql";
import { Editor } from "./ui/editor";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./ui/card";
import Blocks from "editorjs-blocks-react-renderer";

type AuthorType = Pick<User, "displayName" | "id">;

interface PostItemProps {
	post: Pick<Post, "id" | "title" | "published" | "createdAt" | "content"> & {
		author: AuthorType;
	};
}

export const Article = (dataFromEditor: any) => (
	<Blocks data={dataFromEditor} />
);

export function PostItemPublic({ post }: PostItemProps) {
	return (
		<div className="flex items-center justify-between p-4">
			<div className="grid gap-1 w-full">
				<Card className="p-4">
					<CardTitle>
						<div className=" flex justify-between h-10">
							<Link
								href={`/editor/${post.id}`}
								className="font-semibold hover:underline text-2xl pb-16"
							>
								{post.title}
							</Link>
							<PostOperations
								post={{ id: post.id, title: post.title }}
							/>
						</div>
					</CardTitle>
					<CardDescription>
						Posted by {post.author.displayName} on{" "}
						{formatDate(post.createdAt)}
					</CardDescription>
					<div className="pt-4">
						<Blocks
							data={post.content}
							config={{
								code: {
									className: "language-js",
								},
								delimiter: {
									className: "border border-2 w-16 mx-auto",
								},
								embed: {
									className: "border-0",
								},
								header: {
									className: "font-bold",
								},
								image: {
									className: "w-full max-w-screen-md",
									actionsClassNames: {
										stretched: "w-full h-80 object-cover",
										withBorder: "border border-2",
										withBackground: "p-2",
									},
								},
								list: {
									className: "list-disc list-inside",
								},
								paragraph: {
									className: "text-base text-opacity-75",
									actionsClassNames: {
										alignment: "text-{alignment}", // This is a substitution placeholder: left or center.
									},
								},
								quote: {
									className: "py-3 px-5 italic font-serif",
								},
								table: {
									className: "table-auto ",
								},
							}}
						/>
					</div>
				</Card>
				{/* <CardHeader>
						<CardTitle>
							<Link
								href={`/editor/${post.id}`}
								className="font-semibold hover:underline"
							>
								{post.title}
							</Link>
						</CardTitle>
						<CardDescription>
							{formatDate(post.createdAt)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="prose">{JSON.stringify(post.content.blocks)}</p>
					</CardContent>
					<CardFooter>
						<p>Card Footer</p>
					</CardFooter>
				</Card> */}
			</div>
			{/* <PostOperations post={{ id: post.id, title: post.title }} /> */}
		</div>
	);
}

PostItemPublic.Skeleton = function PostItemSkeleton() {
	return (
		<div className="p-4">
			<div className="space-y-3">
				<Skeleton className="h-5 w-2/5" />
				<Skeleton className="h-4 w-4/5" />
			</div>
		</div>
	);
};
