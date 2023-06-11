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
    "mutation Login($input: LoginDto!) {\n  login(input: $input) {\n    user {\n      ...UserInfo\n    }\n    error {\n      type\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout\n}": types.LogoutDocument,
    "mutation RefreshToken($refreshToken: String!) {\n  refreshToken(input: {refreshToken: $refreshToken}) {\n    accessToken\n  }\n}": types.RefreshTokenDocument,
    "mutation Register($input: CreateAccountDto!) {\n  register(input: $input) {\n    user {\n      ...UserInfo\n    }\n    error {\n      type\n      message\n    }\n  }\n}": types.RegisterDocument,
    "mutation ResendConfirmationEmail {\n  resendConfirmationEmail {\n    success\n    message\n  }\n}": types.ResendConfirmationEmailDocument,
    "mutation ResetPassword($email: String!) {\n  resetPassword(email: $email) {\n    email\n    success\n    message\n  }\n}": types.ResetPasswordDocument,
    "mutation SetNewPassword($input: SetNewPasswordDto!) {\n  setNewPassword(input: $input) {\n    success\n    message\n    error {\n      type\n      message\n    }\n  }\n}": types.SetNewPasswordDocument,
    "query Me {\n  me {\n    ...UserInfo\n  }\n}": types.MeDocument,
    "fragment UserInfo on User {\n  id\n  email\n  firstName\n  lastName\n  displayName\n  role\n  image\n}": types.UserInfoFragmentDoc,
    "mutation CreatePost($createPostInput: CreatePostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    success\n    error {\n      message\n      type\n    }\n    post {\n      id\n      title\n      content\n      published\n    }\n  }\n}": types.CreatePostDocument,
    "mutation DeletePost($id: String!) {\n  deletePost(id: $id) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}": types.DeletePostDocument,
    "mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    id\n    title\n    content\n    published\n  }\n}": types.UpdatePostDocument,
    "query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    published\n    title\n    content\n  }\n}": types.GetPostDocument,
    "query GetPosts($args: PageOptionsDto!) {\n  posts(args: $args) {\n    data {\n      id\n      published\n      title\n      content\n      createdAt\n    }\n    meta {\n      take\n      pageCount\n      hasNextPage\n      hasPreviousPage\n    }\n  }\n}": types.GetPostsDocument,
    "mutation FollowUser($userId: String!) {\n  followUser(userId: $userId) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}": types.FollowUserDocument,
    "mutation SubscribeToPremium {\n  subscribeToPremium\n}": types.SubscribeToPremiumDocument,
    "mutation unFollowUser($userId: String!) {\n  unfollowUser(userId: $userId) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}": types.UnFollowUserDocument,
    "query GetStripeInfo {\n  getStripeInfo {\n    stripeCustomerId\n    stripeSubscriptionId\n    stripePriceId\n    stripeCurrentPeriodEnd\n  }\n}": types.GetStripeInfoDocument,
    "query SearchUsers($searchTerm: String!) {\n  searchUsers(searchTerm: $searchTerm) {\n    ...UserInfo\n  }\n}": types.SearchUsersDocument,
    "query subscriptionIsCancelled {\n  subscriptionIsCancelled\n}": types.SubscriptionIsCancelledDocument,
    "mutation UpdateUser($updateUserDto: UpdateUserDto!) {\n  updateUser(updateUserDto: $updateUserDto) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}": types.UpdateUserDocument,
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
export function graphql(source: "mutation Login($input: LoginDto!) {\n  login(input: $input) {\n    user {\n      ...UserInfo\n    }\n    error {\n      type\n      message\n    }\n  }\n}"): (typeof documents)["mutation Login($input: LoginDto!) {\n  login(input: $input) {\n    user {\n      ...UserInfo\n    }\n    error {\n      type\n      message\n    }\n  }\n}"];
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
export function graphql(source: "mutation Register($input: CreateAccountDto!) {\n  register(input: $input) {\n    user {\n      ...UserInfo\n    }\n    error {\n      type\n      message\n    }\n  }\n}"): (typeof documents)["mutation Register($input: CreateAccountDto!) {\n  register(input: $input) {\n    user {\n      ...UserInfo\n    }\n    error {\n      type\n      message\n    }\n  }\n}"];
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
export function graphql(source: "query Me {\n  me {\n    ...UserInfo\n  }\n}"): (typeof documents)["query Me {\n  me {\n    ...UserInfo\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment UserInfo on User {\n  id\n  email\n  firstName\n  lastName\n  displayName\n  role\n  image\n}"): (typeof documents)["fragment UserInfo on User {\n  id\n  email\n  firstName\n  lastName\n  displayName\n  role\n  image\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreatePost($createPostInput: CreatePostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    success\n    error {\n      message\n      type\n    }\n    post {\n      id\n      title\n      content\n      published\n    }\n  }\n}"): (typeof documents)["mutation CreatePost($createPostInput: CreatePostInput!) {\n  createPost(createPostInput: $createPostInput) {\n    success\n    error {\n      message\n      type\n    }\n    post {\n      id\n      title\n      content\n      published\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeletePost($id: String!) {\n  deletePost(id: $id) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"): (typeof documents)["mutation DeletePost($id: String!) {\n  deletePost(id: $id) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    id\n    title\n    content\n    published\n  }\n}"): (typeof documents)["mutation UpdatePost($updatePostInput: UpdatePostInput!) {\n  updatePost(updatePostInput: $updatePostInput) {\n    id\n    title\n    content\n    published\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    published\n    title\n    content\n  }\n}"): (typeof documents)["query GetPost($id: String!) {\n  post(id: $id) {\n    id\n    published\n    title\n    content\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetPosts($args: PageOptionsDto!) {\n  posts(args: $args) {\n    data {\n      id\n      published\n      title\n      content\n      createdAt\n    }\n    meta {\n      take\n      pageCount\n      hasNextPage\n      hasPreviousPage\n    }\n  }\n}"): (typeof documents)["query GetPosts($args: PageOptionsDto!) {\n  posts(args: $args) {\n    data {\n      id\n      published\n      title\n      content\n      createdAt\n    }\n    meta {\n      take\n      pageCount\n      hasNextPage\n      hasPreviousPage\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation FollowUser($userId: String!) {\n  followUser(userId: $userId) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"): (typeof documents)["mutation FollowUser($userId: String!) {\n  followUser(userId: $userId) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SubscribeToPremium {\n  subscribeToPremium\n}"): (typeof documents)["mutation SubscribeToPremium {\n  subscribeToPremium\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation unFollowUser($userId: String!) {\n  unfollowUser(userId: $userId) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"): (typeof documents)["mutation unFollowUser($userId: String!) {\n  unfollowUser(userId: $userId) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetStripeInfo {\n  getStripeInfo {\n    stripeCustomerId\n    stripeSubscriptionId\n    stripePriceId\n    stripeCurrentPeriodEnd\n  }\n}"): (typeof documents)["query GetStripeInfo {\n  getStripeInfo {\n    stripeCustomerId\n    stripeSubscriptionId\n    stripePriceId\n    stripeCurrentPeriodEnd\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchUsers($searchTerm: String!) {\n  searchUsers(searchTerm: $searchTerm) {\n    ...UserInfo\n  }\n}"): (typeof documents)["query SearchUsers($searchTerm: String!) {\n  searchUsers(searchTerm: $searchTerm) {\n    ...UserInfo\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query subscriptionIsCancelled {\n  subscriptionIsCancelled\n}"): (typeof documents)["query subscriptionIsCancelled {\n  subscriptionIsCancelled\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUser($updateUserDto: UpdateUserDto!) {\n  updateUser(updateUserDto: $updateUserDto) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"): (typeof documents)["mutation UpdateUser($updateUserDto: UpdateUserDto!) {\n  updateUser(updateUserDto: $updateUserDto) {\n    success\n    error {\n      message\n      type\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;