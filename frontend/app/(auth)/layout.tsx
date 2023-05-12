"use client";
import { useAuth } from "@/contexts/AuthContext";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="min-h-screen">
			<div>{children}</div>
		</div>
	);
}
