import { useQuery, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  access_token: Scalars['String'];
  refresh_token: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTweet: Tweet;
  deleteUser: Scalars['Boolean'];
  refreshToken: AuthPayload;
  signin: AuthPayload;
  signup: Scalars['String'];
  updateUser: User;
};


export type MutationCreateTweetArgs = {
  authorId: Scalars['String'];
  content: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationRefreshTokenArgs = {
  refreshTokenInput: RefreshTokenInput;
};


export type MutationSigninArgs = {
  input: SigninDto;
};


export type MutationSignupArgs = {
  input: SignupDto;
};


export type MutationUpdateUserArgs = {
  email: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  tweets: Array<Tweet>;
  users: Array<User>;
};

export type RefreshTokenInput = {
  refresh_token: Scalars['String'];
};

export type SigninDto = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignupDto = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Tweet = {
  __typename?: 'Tweet';
  author: User;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['ID'];
  role: Scalars['String'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, email: string }> };


export const GetUsersDocument = `
    query GetUsers {
  users {
    id
    email
  }
}
    `;
export const useGetUsersQuery = <
      TData = GetUsersQuery,
      TError = unknown
    >(
      variables?: GetUsersQueryVariables,
      options?: UseQueryOptions<GetUsersQuery, TError, TData>
    ) =>
    useQuery<GetUsersQuery, TError, TData>(
      variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
      fetcher<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, variables),
      options
    );