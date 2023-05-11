'use client'
import { useAuth } from "@/contexts/AuthContext";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { logOut } = useAuth();
	return (
		<div className="min-h-screen">
			<div>
                <button onClick={logOut}>logout</button>
                {children}</div>
		</div>
	);
}
