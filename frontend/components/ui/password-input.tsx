import * as React from "react";
import { Icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

export interface PasswordInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, type, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);

		const handleShowPassword = () => {
			setShowPassword(!showPassword);
		};

		return (
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					className={cn(
						"flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					ref={ref}
					{...props}
				/>
				{type === "password" && (
					<div
						className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
						onClick={handleShowPassword}
					>
						<div>
							{showPassword ? <Eye className="stroke-1"/> : <Icons.eyeOff className="stroke-1"/>}
						</div>
					</div>
				)}
			</div>
		);
	}
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
