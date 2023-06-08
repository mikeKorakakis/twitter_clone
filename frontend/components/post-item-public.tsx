'use client'
import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PostOperations } from "@/components/post-operations";
import { Post } from "@/gql/graphql";
import { Editor } from './ui/editor';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "./ui/card";
import Blocks from 'editorjs-blocks-react-renderer';




interface PostItemProps {
	post: Pick<Post, "id" | "title" | "published" | "createdAt" | "content">;
}


export const Article = (dataFromEditor:any) => <Blocks data={dataFromEditor} />;


export function PostItemPublic({ post }: PostItemProps) {
    console.log('post', post.content)
	return (
		<div className="flex items-center justify-between p-4">
			<div className="grid gap-1">           
				{/* <Card> */}
                    <div className="prose pb-4"><h1>{post.title}</h1></div>
                    <Blocks 
                    data={post.content}
                    config={{
                        code: {
                          className: "language-js"
                        },
                        delimiter: {
                          className: "border border-2 w-16 mx-auto"
                        },
                        embed: {
                          className: "border-0"
                        },
                        header: {
                          className: "font-bold"
                        },
                        image: {
                          className: "w-full max-w-screen-md",
                          actionsClassNames: {
                            stretched: "w-full h-80 object-cover",
                            withBorder: "border border-2",
                            withBackground: "p-2",
                          }
                        },
                        list: {
                          className: "list-disc list-inside"
                        },
                        paragraph: {
                          className: "text-base text-opacity-75",
                          actionsClassNames: {
                            alignment: "text-{alignment}", // This is a substitution placeholder: left or center.
                          }
                        },
                        quote: {
                          className: "py-3 px-5 italic font-serif"
                        },
                        table: {
                          className: "table-auto ",
                        }

                      }} 
                />
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
				{/* <Link
					href={`/editor/${post.id}`}
					className="font-semibold hover:underline"
				>
					{post.title}
				</Link>
				<div>
					<p className="text-sm text-muted-foreground">
						{formatDate(post.createdAt)}
					</p>
				</div> */}
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
