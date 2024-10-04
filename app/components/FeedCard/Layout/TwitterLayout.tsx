"use client"
import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import FeedCard from "../page";

import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import { BsTwitter } from "react-icons/bs";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiHome, BiImageAlt, BiUser } from "react-icons/bi";
import Link from "next/link";
import { useGetAllTweets } from "@/hooks/tweet";

interface TwitterSidebarButtons {
    title: string,
    icon: React.ReactNode
    link: string
}

interface TwitterlayoutProps {
    children: React.ReactNode;
}

const Twitterlayout: React.FC<TwitterlayoutProps> = (props) => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();
    const { tweets = [] } = useGetAllTweets()

    const sideBarMenuItems: TwitterSidebarButtons[] = useMemo(() => [
        {
            title: "Home",
            icon: <BiHome />,
            link: '/'
        },
        {
            title: "Explore",
            icon: <BiHash />,
            link: '/'
        },
        {
            title: "Notifications",
            icon: <BiBell />,
            link: '/'
        },
        {
            title: "Messages",
            icon: <BiEnvelope />,
            link: '/'
        },
        {
            title: "Bookmarks",
            icon: <BiBookmark />,
            link: '/'
        },
        {
            title: "Profile",
            icon: <BiUser />,
            link: `/${user?.id}`
        },
    ], [user?.id])

    const handleLoginWithGoogle = useCallback(
        async (cred: CredentialResponse) => {
            const googleToken = cred.credential;
            if (!googleToken) return toast.error(`Google token not found`);

            const { verifyGoogleToken } = await graphqlClient.request(
                verifyUserGoogleTokenQuery,
                { token: googleToken }
            );

            toast.success("Verified Success");
            console.log(verifyGoogleToken);

            if (verifyGoogleToken)
                window.localStorage.setItem("__twitter_token", verifyGoogleToken);

            await queryClient.invalidateQueries({ queryKey: ["curent-user"] });
        },
        [queryClient]
    );

    return (

        <div className="grid grid-cols-12 h-screen w-[100%] px-20 ">
            <div className="col-span-3  justify-start pt-8 pr-4 relative">
                <div className="text-4xl h-fit w-fit hover:bg-gray-700 rounded-full p-2 ml-[10px] cursor-pointer transition-all" >
                    <BsTwitter />
                </div>
                <div className="mt-4 text-xl font-semi-bold">
                    <ul>
                        {sideBarMenuItems.map((item, index) => <li key={index}>
                            <Link href={item?.link} className="flex w-fit justify-start items-center gap-4 hover:bg-gray-700 rounded-lg py-2 px-4 my-2 cursor-pointer transition-all">
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </Link>
                        </li>)}
                    </ul>
                    <button className="bg-[#1d9bf0] p-3 mt-4 rounded-full w-full">Tweet</button>
                </div>
                {user && (<div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 p-3 rounded-xl">

                    <Image className="rounded-full" src={user?.profileImageURL || ""} alt="user" height={50} width={50} />
                    <h3 className="text-xl">{user.firstName}{" " + user.lastName}</h3>
                </div>
                )}
            </div>

            <div className="col-span-6 border-r-[0.5px] border-l-[0.5px] border-gray-600 h-screen overflow-scroll scrollbar-hidden">
                {props.children}





            </div>

            <div className="col-span-3">

                {!user && <div className="p-5 bg-slate-700 rounded-lg">
                    <h1 className="my-2 text-2xl">New to Twitter?</h1>
                    <GoogleLogin
                        onSuccess={handleLoginWithGoogle}
                    />
                </div>}
            </div>
        </div>

    );
};

export default Twitterlayout;