// contexts/AuthContext.tsx
"use client";
import {
	LoginUserDocument,
	LoginUserMutation,
	MeDocument,
	User,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";
import { gqlClient as gqlClient_server } from "@/lib/gql_client_server";
import { loginSchema } from "@/lib/validations/auth";
import { ReactNode, createContext, useContext, useState } from "react";
import { z } from "zod";

type LoginSchema = z.infer<typeof loginSchema>;

type UserType = Pick<User, "email" | "firstName" | "lastName">;

async function logIn(data: LoginSchema) {
	const res = await gqlClient().request(LoginUserDocument, {
		email: data.email.toLowerCase(),
		password: data.password,
	});
	return res;
}

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
	initialUser?: UserType | null;
	logIn: (data: LoginSchema) => Promise<LoginUserMutation>;
	logOut: () => boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{
	children: ReactNode;
	initialUser?: UserType | null;
}> = ({ children, initialUser }) => {
	console.log("initialUser", initialUser);
	// const [user, setUser] = useState<
	// 	UserType | null | undefined
	// >(undefined);
	// me().then((res) => {
	// 	setUser({
	// 		// id: res?.me?.id,
	// 		email: res?.me?.email,
	// 		firstName: res?.me?.firstName,
	// 		lastName: res?.me?.lastName,
	// 	});
	// });

	// const logIn = async (email: string, password: string) => {};
	const logOut = () => true;
	// ...
	// logIn, logOut, and other functions

	return (
		<AuthContext.Provider
			value={{ initialUser, logIn, logOut }}
		>
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
