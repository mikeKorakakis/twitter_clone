// contexts/AuthContext.tsx
"use client";
import {
	LoginDocument,
	LoginMutation,
	LogoutDocument,
	LogoutMutation,
	MeDocument,
	User,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";
import { gqlClient as gqlClient_server } from "@/lib/gql_client_server";
import { loginSchema } from "@/lib/validations/auth";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { z } from "zod";

type LoginSchema = z.infer<typeof loginSchema>;

type UserType = Pick<User, "email" | "firstName" | "lastName">;

// async function me() {
// 	const client = await gqlClient_server();
// 	const res = await client.request(MeDocument, {});
// 	// return res;
// 	return {
// 		email: res?.me?.email,
// 		firstName: res?.me?.firstName,
// 		lastName: res?.me?.lastName,
// 	};
// }

interface AuthContextData {
	user?: UserType | null;
	logIn: (data: LoginSchema) => Promise<LoginMutation>;
	logOut: () => Promise<void>;
}

// interface AuthContextData {
//     context: any
// }

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{
	children: ReactNode;
	initialUser?: UserType | null;
}> = ({ children, initialUser }) => {
	console.log("initialUser", initialUser);

	const [user, setUser] = useState<UserType | null | undefined>(initialUser);

	async function logIn(data: LoginSchema) {
		const res = await gqlClient().request<LoginMutation>(LoginDocument, {
			email: data.email.toLowerCase(),
			password: data.password,
		});
		if (res?.login?.user?.email) setUser(res.login.user);
		return res;
	}

	async function logOut() {
		try {
			console.log("logout");
			const res = await gqlClient().request(LogoutDocument);
			setUser(null);
			return;
		} catch (e) {
			return;
		}
	}

	// me().then((res) => {
	// 	setUser({
	// 		// id: res?.me?.id,
	// 		email: res?.me?.email,
	// 		firstName: res?.me?.firstName,
	// 		lastName: res?.me?.lastName,
	// 	});
	// });
    const context = useMemo(() => ({ user, logIn, logOut }), [user]);

	console.log("user", user);
	return (
		<AuthContext.Provider value={context}>
			{children}
		</AuthContext.Provider>
	);
};

// ...
// useAuth, and other exports
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
