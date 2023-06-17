import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton() {
	return (
		<a
			type="button"
			className={cn(buttonVariants({ variant: "outline" }))}
			href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/google`}
		>
			<Icons.google className="mr-2 h-4 w-4" />
			Google
		</a>
	);
}
