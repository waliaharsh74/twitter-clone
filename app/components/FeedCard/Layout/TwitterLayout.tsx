"use client";
import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import { BsTwitter } from "react-icons/bs";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiHome, BiUser } from "react-icons/bi";
import Link from "next/link";

interface TwitterSidebarButtons {
    title: string;
    icon: React.ReactNode;
    link: string;
}

interface TwitterlayoutProps {
    children: React.ReactNode;
}

const Twitterlayout: React.FC<TwitterlayoutProps> = (props) => {
    const { user } = useCurrentUser();
    const queryClient = useQueryClient();

    const sideBarMenuItems: TwitterSidebarButtons[] = useMemo(() => [
        { title: "Home", icon: <BiHome />, link: '/' },
        { title: "Explore", icon: <BiHash />, link: '/' },
        { title: "Notifications", icon: <BiBell />, link: '/' },
        { title: "Messages", icon: <BiEnvelope />, link: '/' },
        { title: "Bookmarks", icon: <BiBookmark />, link: '/' },
        { title: "Profile", icon: <BiUser />, link: user?`/${user?.id}`:'/' },
    ], [user?.id]);

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

            await queryClient.invalidateQueries({ queryKey: ["current-user"] });
        },
        [queryClient]
    );

    return (
        <div className="grid grid-cols-12 h-screen w-full px-4 md:px-20">
            <div className="col-span-3 pt-8 pr-4 relative">
                <div className="text-4xl h-fit w-fit hover:bg-gray-700 rounded-full p-2 ml-2 cursor-pointer transition-all">
                    <BsTwitter />
                </div>
                <div className="mt-4 text-xl font-semi-bold">
                    <ul>
                        {sideBarMenuItems.map((item, index) => (
                            <li key={index}>
                                <Link href={item.link} className="flex flex-col w-fit justify-start items-center gap-4 hover:bg-gray-700 rounded-lg py-2 px-4 my-2 cursor-pointer transition-all">
                                    <span className="block text-3xl md:hidden">{item.icon}</span>
                                    <span className="hidden md:flex  w-fit justify-start items-center gap-4 hover:bg-gray-700 rounded-lg  cursor-pointer transition-all"> <span>{item.icon}</span>
                                    <span>{item.title}</span></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <button className="bg-[#1d9bf0] p-3 mt-4 rounded-full w-full md:w-[80%]">Tweet</button>
                </div>
                {user && (
                    <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 p-3 rounded-xl">
                        <Image className="rounded-full" src={user.profileImageURL || ""} alt="user" height={50} width={50} />
                        <h3 className="text-xl hidden md:block">{user.firstName} {user.lastName}</h3>
                    </div>
                )}
            </div>

            {user?(<div className="col-span-9 md:col-span-6 border-r border-l border-gray-600 h-screen overflow-scroll scrollbar-hidden">
                {props.children}
            </div>):( <div className="col-span-9 md:col-span-6  border-l border-gray-600  overflow-scroll scrollbar-hidden p-5 rounded-lg">
                        <h1 className="my-2 text-2xl">New to Twitter?</h1>
                        <GoogleLogin onSuccess={handleLoginWithGoogle} />
                    </div>)}


            <div className="hidden md:block col-span-3">
                {!user ? (
                    <div className="p-5 bg-slate-700 rounded-lg">
                        <h1 className="my-2 text-2xl">New to Twitter?</h1>
                        <GoogleLogin onSuccess={handleLoginWithGoogle} />
                    </div>
                ) : (
                    <div className="px-4 py-3 bg-slate-800 rounded-lg">
                        <h1 className="my-2 text-2xl mb-5">Users you may know</h1>
                        {user.recommendedUsers?.map((el) => (
                            <div className="flex items-center gap-3 mt-2" key={el?.id}>
                                {el?.profileImageURL && (
                                    <Image
                                        src={el?.profileImageURL}
                                        alt="user-image"
                                        className="rounded-full"
                                        width={60}
                                        height={60}
                                    />
                                )}
                                <div>
                                    <div className="text-lg">{el?.firstName} {el?.lastName}</div>
                                    <Link
                                        href={`/${el?.id}`}
                                        className="bg-white text-black text-sm px-5 py-1 w-full rounded-lg"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Twitterlayout;
