import { graphql } from "../../gql"
export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
        getAllTweets {
            id
            content
            author {
             id
             firstName
             email
             lastName
             profileImageURL
            }
        }
    }
    
`)

