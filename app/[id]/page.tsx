"use client"
import { useRouter, useParams } from "next/navigation";
import SkeletonLoader from "./Skeleton";
import type { NextPage } from "next"
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs"
import FeedCard from "../components/FeedCard/page";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import { followUserMutation, unFollowUserMutation } from "@/graphql/mutations/user";
import { useQueryClient } from "@tanstack/react-query";

interface ServerProps {
    user?: User
}

const UserProfilePage: NextPage<ServerProps> = () => {
    const [userInfo, setUserinfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const { user: currentUser } = useCurrentUser();
    const queryClient = useQueryClient()
    let { id } = useParams();
    id = Array.isArray(id) ? id[0] : id;
    const router = useRouter()
    if (!router) {
        return <div>Loading...</div>;
    }
    const amIFollowing = useMemo(() => {
        if (!userInfo) return false
        if (!currentUser) return false
        return (userInfo?.followers?.findIndex((ele) => ele?.id == currentUser.id) ?? -1) >= 0
    }, [userInfo, currentUser?.followers])


    const handleFollow = useCallback(async () => {
        if (!userInfo || !currentUser) return;

        await graphqlClient.request(followUserMutation, { to: userInfo.id });


        setUserinfo(prev => {
            if (prev) {
                return {
                    ...prev,
                    followers: [...(prev.followers || []), currentUser],
                };
            }
            return prev;
        });

        await queryClient.invalidateQueries({ queryKey: ['current-user'] });
    }, [userInfo, currentUser, queryClient]);

    const handleUnFollow = useCallback(async () => {
        if (!userInfo || !currentUser) return;

        await graphqlClient.request(unFollowUserMutation, { to: userInfo.id });


        {
            setUserinfo(prev => {
                if (prev) {
                    return {
                        ...prev,
                        followers: prev.followers ? prev.followers.filter(follower => follower?.id !== currentUser.id) : [],
                    };
                }
                return prev;
            });
        }

        await queryClient.invalidateQueries({ queryKey: ['current-user'] });
    }, [userInfo, currentUser, queryClient]);



    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await graphqlClient.request(getUserByIdQuery, { id });
                if (info.getUserById)
                    setUserinfo(info?.getUserById);
                
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
            finally{
                setLoading(false)
            }
        };

        if (id) {
            fetchUserInfo();
        }
    }, [id]);
    if(loading)return <SkeletonLoader/>
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
                    {currentUser && userInfo && currentUser.id !== userInfo.id &&
                        (amIFollowing ? <button onClick={handleUnFollow} className="bg-white p-3 text-black rounded-full text-sm">unfollow</button> : <button onClick={handleFollow} className="bg-white p-3 text-black rounded-full text-sm">follow</button>)
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




