import { graphqlClient } from "@/clients/api"
import { getCurrentUser } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => graphqlClient.request(getCurrentUser)
    })
    return { ...query, user: query?.data?.getCurrentUser }
}

export const useGetUserById = (id: string) => {


}