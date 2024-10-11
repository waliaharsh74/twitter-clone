"use client"
import { useRouter, useParams } from "next/navigation";
import type { NextPage } from "next"
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs"
import FeedCard from "../components/FeedCard/page";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/user";

interface ServerProps {
    user?: User
}

const UserProfilePage: NextPage<ServerProps> = () => {
    const [userInfo, setUserinfo] = useState<User | null>(null);
    const { user:currentUser } = useCurrentUser();
    let { id } = useParams();
    id = Array.isArray(id) ? id[0] : id;
    const router = useRouter()
    if (!router) {
        return <div>Loading...</div>;
    }
    const amIFollowing=useMemo(()=>{
        if(!userInfo)return false
        return(currentUser?.followers?.findIndex((ele)=>ele?.id==userInfo.id)??-1)>=0
    },[userInfo,currentUser?.followers])



    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await graphqlClient.request(getUserByIdQuery, { id });
                if (info.getUserById)
                    setUserinfo(info.getUserById);
                console.log(userInfo);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        if (id) {
            fetchUserInfo();
        }
    }, [id]);
    return (
        <div className="">
            <nav className=" flex items-center gap-3 p-3 ">
                <BsArrowLeftShort className="text-3xl" />
                <div>
                    <h1 className="text-xl font-bold">{userInfo?.firstName + " " + userInfo?.lastName}</h1>
                    <h1 className="text-md font-bold text-slate-500 ">{userInfo?.tweets?.length} tweets</h1>

                </div>
            </nav>
            <div className="p-4 border-b border-slate-800">

                {userInfo?.profileImageURL && <Image className="rounded-full" src={userInfo?.profileImageURL} width={100} height={100} alt="profile Image" />}
                <h1 className="text-xl font-bold mt-5">{userInfo?.firstName + " " + userInfo?.lastName}</h1>
                <div className="flex justify-between items-center">

                    <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        <span>{`followers: ` + userInfo?.followers?.length}</span>
                        <span>{`following: ` + userInfo?.following?.length}</span>
                    </div>
                  { currentUser && userInfo && currentUser.id!==userInfo.id &&
                   (amIFollowing ?<button className="bg-white p-3 text-black rounded-full text-sm">follow</button>:<button className="bg-white p-3 text-black rounded-full text-sm">unfollow</button>)
                   }
                </div>
            </div>
            <div>
                {userInfo?.tweets?.map((tweet) => tweet && <FeedCard data={tweet as Tweet} key={tweet.id} />)}
            </div>
        </div>
    )
}

export default UserProfilePage




// export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
//     const id = context.query.id as string | undefined;
//     if (!id) return { notFound: true, props: { user: undefined } }
//     const userInfo = await graphqlClient.request(getUserByIdQuery, { id })
//     if (!userInfo?.getUserById) return { notFound: true, props: { user: undefined } }
//     console.log(id);
//     return {
//         props: {
//             userInfo: userInfo?.getUserById as User
//         }
//     }

// }