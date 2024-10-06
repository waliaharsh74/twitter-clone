import { graphql } from "../../gql"
export const getAllTweetsQuery = graphql(`#graphql
    query GetAllTweets {
        getAllTweets {
            id
            content
            imageUrl
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
export const getSignedURLForTweetQuery = graphql(`#graphql
    query GetSignedURL($imageName: String!, $imageType: String!) {
        getSignedURLForTweet(imageName: $imageName, imageType: $imageType)
    }
    
`)

