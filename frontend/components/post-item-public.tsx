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
                
                    <Blocks 
                    data={post.content}
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
