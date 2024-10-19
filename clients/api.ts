import { GraphQLClient } from "graphql-request";
import 'dotenv/config'
const isClient = typeof window !== undefined

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_BACKEND_URI as string, {
    headers: () => ({
        Authorization: isClient ? `Bearer ${window.localStorage.getItem('__twitter_token')}` : ''
    })
})