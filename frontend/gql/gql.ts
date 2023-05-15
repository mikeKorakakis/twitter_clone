/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation ChangePassword($input: PasswordValuesDto!) {\n  changePassword(input: $input) {\n    success\n    message\n    error {\n      message\n      type\n    }\n  }\n}": types.ChangePasswordDocument,
    "mutation ConfirmEmail($token: String!) {\n  confirmEmail(token: $token) {\n    message\n    success\n  }\n}": types.ConfirmEmailDocument,
    "mutation Login($input: LoginDto!) {\n  login(input: $input) {\n    user {\n      email\n      firstName\n      lastName\n      displayName\n      image\n    }\n    error {\n      type\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation RefreshToken($refreshToken: String!) {\n  refreshToken(input: {refreshToken: $refreshToken}) {\n    accessToken\n  }\n}": types.RefreshTokenDocument,
    "mutation Register($input: CreateAccountDto!) {\n  register(input: $input) {\n    user {\n      email\n      firstName\n      lastName\n      displayName\n      image\n    }\n    error {\n      type\n      message\n    }\n  }\n}": types.RegisterDocument,
    "mutation ResendConfirmationEmail {\n  resendConfirmationEmail {\n    success\n    message\n  }\n}": types.ResendConfirmationEmailDocument,
    "mutation ResetPassword($email: String!) {\n  resetPassword(email: $email) {\n    email\n    success\n    message\n  }\n}": types.ResetPasswordDocument,
    "mutation SetNewPassword($input: SetNewPasswordDto!) {\n  setNewPassword(input: $input) {\n    success\n    message\n    error {\n      type\n      message\n    }\n  }\n}": types.SetNewPasswordDocument,
    "query Me {\n  me {\n    email\n    firstName\n    lastName\n    displayName\n    role\n    image\n  }\n}": types.MeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($input: PasswordValuesDto!) {\n  changePassword(input: $input) {\n    success\n    message\n    error {\n      message\n      type\n    }\n  }\n}"): (typeof documents)["mutation ChangePassword($input: PasswordValuesDto!) {\n  changePassword(input: $input) {\n    success\n    message\n    error {\n      message\n      type\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ConfirmEmail($token: String!) {\n  confirmEmail(token: $token) {\n    message\n    success\n  }\n}"): (typeof documents)["mutation ConfirmEmail($token: String!) {\n  confirmEmail(token: $token) {\n    message\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginDto!) {\n  login(input: $input) {\n    user {\n      email\n      firstName\n      lastName\n      displayName\n      image\n    }\n    error {\n      type\n      message\n    }\n  }\n}"): (typeof documents)["mutation Login($input: LoginDto!) {\n  login(input: $input) {\n    user {\n      email\n      firstName\n      lastName\n      displayName\n      image\n    }\n    error {\n      type\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout\n}"): (typeof documents)["mutation Logout {\n  logout\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RefreshToken($refreshToken: String!) {\n  refreshToken(input: {refreshToken: $refreshToken}) {\n    accessToken\n  }\n}"): (typeof documents)["mutation RefreshToken($refreshToken: String!) {\n  refreshToken(input: {refreshToken: $refreshToken}) {\n    accessToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($input: CreateAccountDto!) {\n  register(input: $input) {\n    user {\n      email\n      firstName\n      lastName\n      displayName\n      image\n    }\n    error {\n      type\n      message\n    }\n  }\n}"): (typeof documents)["mutation Register($input: CreateAccountDto!) {\n  register(input: $input) {\n    user {\n      email\n      firstName\n      lastName\n      displayName\n      image\n    }\n    error {\n      type\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ResendConfirmationEmail {\n  resendConfirmationEmail {\n    success\n    message\n  }\n}"): (typeof documents)["mutation ResendConfirmationEmail {\n  resendConfirmationEmail {\n    success\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ResetPassword($email: String!) {\n  resetPassword(email: $email) {\n    email\n    success\n    message\n  }\n}"): (typeof documents)["mutation ResetPassword($email: String!) {\n  resetPassword(email: $email) {\n    email\n    success\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SetNewPassword($input: SetNewPasswordDto!) {\n  setNewPassword(input: $input) {\n    success\n    message\n    error {\n      type\n      message\n    }\n  }\n}"): (typeof documents)["mutation SetNewPassword($input: SetNewPasswordDto!) {\n  setNewPassword(input: $input) {\n    success\n    message\n    error {\n      type\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Me {\n  me {\n    email\n    firstName\n    lastName\n    displayName\n    role\n    image\n  }\n}"): (typeof documents)["query Me {\n  me {\n    email\n    firstName\n    lastName\n    displayName\n    role\n    image\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;