// contexts/AuthContext.tsx
"use client";
import {
	LoginDocument,
	LoginMutation,
	LogoutDocument,
	LogoutMutation,
	MeDocument,
	RegisterDocument,
	RegisterMutation,
	User,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";
import { gqlClient as gqlClient_server } from "@/lib/gql_client_server";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { z } from "zod";

type LoginSchema = z.infer<typeof loginSchema>;

type UserType = Pick<User, "email" | "firstName" | "lastName" | "displayName">;

type RegisterSchema = z.infer<typeof registerSchema>;

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
	register: (data: RegisterSchema) => Promise<RegisterMutation>;
}

// interface AuthContextData {
//     context: any
// }

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{
	children: ReactNode;
	initialUser?: UserType | null;
}> = ({ children, initialUser }) => {
	const [user, setUser] = useState<UserType | null | undefined>(initialUser);

	async function logIn(data: LoginSchema) {
		const res = await gqlClient().request<LoginMutation>(LoginDocument, {
			email: data.email.toLowerCase(),
			password: data.password,
		});
		if (res?.login?.user?.email) setUser(res.login.user);
		return res;
	}

	async function register(data: RegisterSchema) {
		const res = await gqlClient().request<RegisterMutation>(
			RegisterDocument,
			{
				email: data.email.toLowerCase(),
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				displayName: data.displayName,
			}
		);
		if (res?.register?.user?.email) setUser(res.register.user);
		return res;
	}

	async function logOut() {
		try {
			const res = await gqlClient().request<LogoutMutation>(
				LogoutDocument
			);
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
	const context = useMemo(() => ({ user, logIn, logOut, register }), [user]);

	return (
		<AuthContext.Provider value={context}>{children}</AuthContext.Provider>
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
