import { graphql } from "../../gql"
export const verifyUserGoogleTokenQuery = graphql(`#graphql
    query VerifyUserGoogleToken($token:String!){
        verifyGoogleToken(token: $token)
    }
`)
export const getCurrentUser = graphql(`#graphql
    query GetCurrentUser {
        getCurrentUser {
          id,
          profileImageURL
          email
          firstName
          lastName
        }
    }
`)