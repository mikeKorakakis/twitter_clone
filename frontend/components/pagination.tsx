"use client";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import { redirect, useRouter } from "next/navigation";

interface PaginationProps {
	totalPages?: number;
	pageSize?: number;
	pageIndex?: number;
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
}

export function Pagination({
	totalPages = 1,
	pageSize = siteConfig.defaultPageSize,
	pageIndex = 1,
	hasNextPage,
	hasPreviousPage,
}: PaginationProps) {
    const router = useRouter()
	return (
		<div className="flex items-center justify-between px-2 ">
			{/* <div className="flex-1 text-sm text-muted-foreground">
        {pageIndex} of{" "}
        {totalPages} row(s) selected.
      </div> */}
			<div className="grow"></div>
			<div className="flex items-center space-x-6 lg:space-x-8 self-end">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Items per page</p>
					<Select
						value={pageSize.toString()}
						onValueChange={(value) =>
							router.push(
								siteConfig.pages.posts + `/${pageIndex}?pageSize=${value}`
							)
						}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[4, 10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {pageIndex} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() =>
							router.push(
								siteConfig.pages.posts + `/1`
							)
						}
						disabled={!hasPreviousPage}
						// onClick={() => table.setPageIndex(0)}
						// disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() =>
							router.push(
								siteConfig.pages.posts + `/${pageIndex - 1}`
							)
						}
						disabled={!hasPreviousPage}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() =>
							router.push(
								siteConfig.pages.posts + `/${pageIndex + 1}`
							)
						}
						disabled={!hasNextPage}
						// onClick={() => table.nextPage()}
						// disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() =>
							router.push(
								siteConfig.pages.posts + `/${totalPages}`
							)
						}
						disabled={!hasNextPage}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
